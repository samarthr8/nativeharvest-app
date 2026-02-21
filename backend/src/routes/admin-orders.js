const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/orders", auth, async (req, res) => {
  try {

    const ordersRes = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    const orders = ordersRes.rows;

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


/* 🔥 NEW: Download Invoice (JSON) */
router.get("/orders/:orderId/invoice", auth, async (req, res) => {

  try {

    const { orderId } = req.params;

    const orderRes = await db.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [orderId]
    );

    if (orderRes.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderRes.rows[0];

    const itemsRes = await db.query(
      `
      SELECT product_name, price, quantity, variant_key
      FROM order_items
      WHERE order_id = $1
      `,
      [orderId]
    );

    const invoiceData = {
      order,
      items: itemsRes.rows
    };

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${orderId}-invoice.json`
    );

    res.json(invoiceData);

  } catch (err) {
    console.error("Invoice generation failed:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
});

module.exports = router;