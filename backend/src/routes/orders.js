const express = require("express");
const router = express.Router();
const db = require("../config/db");
const crypto = require("crypto");

/*
  POST /api/orders
  Body:
  {
    customer_name,
    phone,
    email,
    address,
    items: [{ slug, qty }]
  }
*/
router.post("/", async (req, res) => {
  try {
    const { customer_name, phone, email, address, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch products from DB
    const slugs = items.map(i => i.slug);
    const result = await db.query(
      "SELECT slug, name, price FROM products WHERE slug = ANY($1)",
      [slugs]
    );

    if (result.rows.length !== items.length) {
      return res.status(400).json({ message: "Invalid product in cart" });
    }

    // Calculate total
    let total = 0;
    const orderItems = result.rows.map(product => {
      const cartItem = items.find(i => i.slug === product.slug);
      const lineTotal = product.price * cartItem.qty;
      total += lineTotal;

      return {
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty: cartItem.qty
      };
    });

    const orderId = "NH-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    // Insert order
    await db.query(
      `INSERT INTO orders 
       (order_id, customer_name, phone, email, address, total_amount, status)
       VALUES ($1,$2,$3,$4,$5,$6,'CREATED')`,
      [orderId, customer_name, phone, email, address, total]
    );

    // Insert order items
    for (const item of orderItems) {
      await db.query(
        `INSERT INTO order_items
         (order_id, product_slug, product_name, price, quantity)
         VALUES ($1,$2,$3,$4,$5)`,
        [orderId, item.slug, item.name, item.price, item.qty]
      );
    }

    res.json({
      order_id: orderId,
      total_amount: total,
      status: "CREATED"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

module.exports = router;
