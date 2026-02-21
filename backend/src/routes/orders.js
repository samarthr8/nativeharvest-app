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
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order items are required");
    }

    await client.query("BEGIN");

    let total = 0;
    const detailedItems = [];

    // -----------------------------
    // Validate stock + calculate total
    // -----------------------------
    for (const item of items) {

      const productRes = await client.query(
        "SELECT name, stock FROM products WHERE slug = $1",
        [item.slug]
      );

      if (productRes.rowCount === 0) {
        throw new Error(`Product not found: ${item.slug}`);
      }

      const product = productRes.rows[0];

      // Stock check
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${item.slug}`);
      }

      const itemPrice = item.price;

      total += itemPrice * item.qty;

      detailedItems.push({
        slug: item.slug,
        name: product.name,
        price: itemPrice,
        qty: item.qty
      });
    }

    // -----------------------------
    // Reduce stock
    // -----------------------------
    for (const item of detailedItems) {

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE slug = $2
        `,
        [item.qty, item.slug]
      );
    }

    const orderId = "NH-" + uuidv4().slice(0, 8).toUpperCase();

    // -----------------------------
    // Insert into orders table
    // -----------------------------
    await client.query(
      `
      INSERT INTO orders
      (order_id, customer_name, phone, email, address, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [orderId, customer_name, phone, email, address, total]
    );

    // -----------------------------
    // Insert into order_items table
    // -----------------------------
    for (const item of detailedItems) {

      await client.query(
        `
        INSERT INTO order_items
        (order_id, product_slug, product_name, price, quantity)
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          orderId,
          item.slug,
          item.name,
          item.price,
          item.qty
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