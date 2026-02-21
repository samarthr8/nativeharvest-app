const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/orders", auth, async (req, res) => {
  try {

    // Get all orders
    const ordersRes = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    const orders = ordersRes.rows;

    // For each order, fetch order_items
    for (let order of orders) {

      const itemsRes = await db.query(
        `
        SELECT product_slug, product_name, price, quantity, variant_key
        FROM order_items
        WHERE order_id = $1
        `,
        [order.order_id]
      );

      order.items = itemsRes.rows;
    }

    res.json(orders);

  } catch (err) {
    console.error("Failed to load admin orders:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

module.exports = router;
