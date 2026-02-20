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

    await client.query("BEGIN");

    let total = 0;

    for (const item of items) {

      const productRes = await client.query(
        "SELECT stock FROM products WHERE slug = $1",
        [item.slug]
      );

      if (productRes.rowCount === 0) {
        throw new Error("Product not found");
      }

      const product = productRes.rows[0];

      // 🔥 STOCK CHECK
      if (product.stock < item.qty) {
        throw new Error(`Insufficient stock for ${item.slug}`);
      }

      // ✅ USE FRONTEND PRICE (variant price if exists)
      const itemPrice = item.price;

      total += itemPrice * item.qty;
    }

    // 🔥 Reduce stock
    for (const item of items) {

      await client.query(
        `
        UPDATE products
        SET stock = stock - $1
        WHERE slug = $2
        `,
        [item.qty, item.slug]
      );
    }

    const orderId = "NH-" + uuidv4().slice(0,8).toUpperCase();

    await client.query(
      `
      INSERT INTO orders
      (order_id, customer_name, phone, email, address, total_amount)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [orderId, customer_name, phone, email, address, total]
    );

    await client.query("COMMIT");

    res.json({
      order_id: orderId
    });

  } catch (err) {

    await client.query("ROLLBACK");

    console.error(err);

    res.status(400).json({
      message: err.message
    });

  } finally {
    client.release();
  }
});

module.exports = router;
