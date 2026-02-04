const express = require("express");
const db = require("../config/db");

const router = express.Router();

/**
 * GET payment status
 */
router.get("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await db.query(
      `SELECT payment_status FROM orders WHERE order_id = $1`,
      [orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.json({
      payment_status: result.rows[0].payment_status
    });

  } catch (err) {
    console.error("Order status error:", err);
    res.status(500).json({
      message: "Failed to fetch order status"
    });
  }
});

module.exports = router;
