const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/* --- NEW: Import the checkout rate limiter --- */
const { checkoutLimiter } = require("../middleware/rateLimiter");

/* =========================================
   NEW: VALIDATE COUPON ROUTE
========================================= */
router.post("/validate-coupon", async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    const result = await db.query(
      "SELECT * FROM coupons WHERE code = $1 AND is_active = true",
      [code.toUpperCase()]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ message: "Invalid or expired coupon code" });
    }

    const coupon = result.rows[0];

    if (subtotal < coupon.min_cart_value) {
      return res.status(400).json({ 
        message: `Cart total must be at least ₹${coupon.min_cart_value} to use this coupon` 
      });
    }

    let discountAmount = 0;
    if (coupon.discount_type === 'PERCENT') {
      discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
    } else if (coupon.discount_type === 'FLAT') {
      discountAmount = coupon.discount_value;
    }

    // Ensure we don't discount more than the cart value
    discountAmount = Math.min(discountAmount, subtotal);

    res.json({
      success: true,
      code: coupon.code,
      discountAmount,
      message: "Coupon applied successfully!"
    });

  } catch (err) {
    console.error("Coupon validation error:", err);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
});


/* =========================================
   MAIN ORDER CREATION ROUTE
   (Now protected by checkoutLimiter)
========================================= */
router.post("/", checkoutLimiter, async (req, res) => {

  const client = await db.connect();

  try {

    const {
      customer_name,
      phone,
      email,
      address,
      full_address,
      city,
      state,
      pincode,
      items,
      coupon_code
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order items are required");
    }

    await client.query("BEGIN");

    let subtotal = 0;
    const detailedItems = [];

    // -----------------------------
    // Validate stock + calculate subtotal
    // -----------------------------
    for (const item of items) {
      // 🔥 CRITICAL: "FOR UPDATE" locks this row
      const productRes = await client.query(
        "SELECT name, stock, variants FROM products WHERE slug = $1 FOR UPDATE",
        [item.slug]
      );

      if (productRes.rowCount === 0) {
        throw new Error(`Product not found: ${item.slug}`);
      }

      const product = productRes.rows[0];
      let availableStock = product.stock;

      if (item.variant_key && product.variants) {
        const variantData = product.variants.find(v => v.weight === item.variant_key);
        if (variantData && variantData.stock !== undefined) {
          availableStock = variantData.stock;
        }
      }

      if (availableStock < item.qty) {
        throw new Error(`Insufficient stock for ${product.name} ${item.variant_key ? `(${item.variant_key})` : ''}`);
      }

      const itemPrice = item.price;
      subtotal += itemPrice * item.qty;

      detailedItems.push({
        slug: item.slug,
        name: product.name,
        price: itemPrice,
        qty: item.qty,
        variantKey: item.variant_key || item.variantKey || null
      });
    }

    // -----------------------------
    // Calculate Discount
    // -----------------------------
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon_code) {
      const couponRes = await client.query(
        "SELECT * FROM coupons WHERE code = $1 AND is_active = true", 
        [coupon_code.toUpperCase()]
      );
      
      if (couponRes.rowCount > 0) {
        const coupon = couponRes.rows[0];
        if (subtotal >= coupon.min_cart_value) {
          appliedCoupon = coupon.code;
          if (coupon.discount_type === 'PERCENT') {
            discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
          } else {
            discountAmount = coupon.discount_value;
          }
          discountAmount = Math.min(discountAmount, subtotal);
        }
      }
    }

    const discountedSubtotal = subtotal - discountAmount;

    // -----------------------------
    // Calculate Final Total with Shipping
    // -----------------------------
    const SHIPPING_FEE = 80;
    const FREE_SHIPPING_THRESHOLD = 999;    
    
    // --- FIXED: Free shipping evaluates against the original subtotal ---
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    
    const finalTotal = discountedSubtotal + shippingCost;

    // -----------------------------
    // Reduce stock (Variant-Aware)
    // -----------------------------
    for (const item of detailedItems) {

      if (item.variantKey) {
        const productRes = await client.query("SELECT stock, variants FROM products WHERE slug = $1", [item.slug]);
        const product = productRes.rows[0];

        const updatedVariants = product.variants.map(v => {
          if (v.weight === item.variantKey) {
            return { ...v, stock: Math.max(0, (v.stock || 0) - item.qty) };
          }
          return v;
        });

        const newTotalStock = Math.max(0, product.stock - item.qty);

        await client.query(
          "UPDATE products SET variants = $1, stock = $2 WHERE slug = $3",
          [JSON.stringify(updatedVariants), newTotalStock, item.slug]
        );

      } else {
        await client.query(
          "UPDATE products SET stock = stock - $1 WHERE slug = $2",
          [item.qty, item.slug]
        );
      }
    }

    const orderId = "NH-" + uuidv4().slice(0, 8).toUpperCase();

    // -----------------------------
    // Insert into orders
    // -----------------------------
    await client.query(
      `
      INSERT INTO orders
      (order_id, customer_name, phone, email,
       address, full_address, city, state, pincode,
       total_amount, shipping_fee, coupon_code, discount_amount) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      `,
      [
        orderId,
        customer_name,
        phone,
        email,
        address,
        full_address || null,
        city || null,
        state || null,
        pincode || null,
        finalTotal,
        shippingCost,
        appliedCoupon,
        discountAmount
      ]
    );

    // -----------------------------
    // Insert into order_items
    // -----------------------------
    for (const item of detailedItems) {
      await client.query(
        `
        INSERT INTO order_items
        (order_id, product_slug, product_name, price, quantity, variant_key)
        VALUES ($1,$2,$3,$4,$5,$6)
        `,
        [
          orderId,
          item.slug,
          item.name,
          item.price,
          item.qty,
          item.variantKey
        ]
      );
    }

    // -----------------------------
    // NEW: Save Email to Subscribers
    // -----------------------------
    if (email) {
      await client.query(
        `INSERT INTO subscribers (email, source) 
         VALUES ($1, 'checkout') 
         ON CONFLICT (email) DO NOTHING`,
        [email.toLowerCase()]
      );
    }

    await client.query("COMMIT");

    res.json({
      order_id: orderId
    });

  } catch (err) {

    await client.query("ROLLBACK");
    console.error("Order creation failed:", err);
    res.status(400).json({
      message: err.message
    });

  } finally {
    client.release();
  }
});

module.exports = router;