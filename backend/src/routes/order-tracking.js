const express = require("express");
const router = express.Router();
const db = require("../config/db");

/**
 * PUBLIC ORDER TRACKING
 */
router.get("/:orderId", async (req, res) => {

  try {

    const { orderId } = req.params;

    const result = await db.query(
      `
      SELECT 
        order_id,
        customer_name,
        phone,
        email,
        total_amount,
        payment_status,
        order_status,
        created_at
      FROM orders
      WHERE order_id = $1
      `,
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error("Order tracking error:", err);

    res.status(500).json({
      message: "Failed to fetch order"
    });
  }
});

module.exports = router;
