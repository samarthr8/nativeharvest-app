const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {

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
      items
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
      // 🔥 CRITICAL: "FOR UPDATE" locks this row until the transaction COMMITs or ROLLBACKs.
      // This prevents race conditions when editing the JSONB array.
      const productRes = await client.query(
        "SELECT name, stock, variants FROM products WHERE slug = $1 FOR UPDATE",
        [item.slug]
      );

      if (productRes.rowCount === 0) {
        throw new Error(`Product not found: ${item.slug}`);
      }

      const product = productRes.rows[0];
      let availableStock = product.stock;

      // If this item is a specific variant, check the variant's stock inside the JSON array
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
    // Calculate Final Total with Shipping
    // -----------------------------
    const SHIPPING_FEE = 80;
    const FREE_SHIPPING_THRESHOLD = 999;    
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const finalTotal = subtotal + shippingCost;

    // -----------------------------
    // Reduce stock (Varient-Aware)
    // -----------------------------
    for (const item of detailedItems) {

      if (item.variantKey) {
        // Fetch the locked row
        const productRes = await client.query("SELECT stock, variants FROM products WHERE slug = $1", [item.slug]);
        const product = productRes.rows[0];

        // Map over the JSON array and reduce the stock of the purchased variant
        const updatedVariants = product.variants.map(v => {
          if (v.weight === item.variantKey) {
            return { ...v, stock: Math.max(0, (v.stock || 0) - item.qty) };
          }
          return v;
        });

        // Also reduce the global product stock so the total inventory is accurate
        const newTotalStock = Math.max(0, product.stock - item.qty);

        // Update JSON and total stock
        await client.query(
          "UPDATE products SET variants = $1, stock = $2 WHERE slug = $3",
          [JSON.stringify(updatedVariants), newTotalStock, item.slug]
        );

      } else {
        // Standard non-variant product
        await client.query(
          "UPDATE products SET stock = stock - $1 WHERE slug = $2",
          [item.qty, item.slug]
        );
      }
    }

    const orderId = "NH-" + uuidv4().slice(0, 8).toUpperCase();

    // -----------------------------
    // Insert into orders (UPDATED with finalTotal)
    // -----------------------------
    // -----------------------------
    // Insert into orders (UPDATED with shipping_fee)
    // -----------------------------
    await client.query(
      `
      INSERT INTO orders
      (order_id, customer_name, phone, email,
       address, full_address, city, state, pincode,
       total_amount, shipping_fee) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
        shippingCost // <--- Pass the shipping cost here
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