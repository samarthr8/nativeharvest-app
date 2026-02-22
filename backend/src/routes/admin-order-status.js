const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/auth");

const {
  sendShipmentNotification,
  sendDeliveredNotification
} = require("../services/emailService");

router.patch("/orders/:orderId/status", verifyAdmin, async (req, res) => {

  try {

    const { orderId } = req.params;
    const { order_status } = req.body;

    const allowedStatuses = [
      "CREATED",
      "PACKED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];

    if (!allowedStatuses.includes(order_status)) {
      return res.status(400).json({
        message: "Invalid order status"
      });
    }

    const result = await db.query(
      `
      UPDATE orders
      SET order_status = $1
      WHERE order_id = $2
      RETURNING *;
      `,
      [order_status, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const updatedOrder = result.rows[0];

    if (order_status === "SHIPPED") {
      try {
        await sendShipmentNotification(updatedOrder);
        console.log("🚚 Shipment notification email sent");
      } catch (emailErr) {
        console.error("Shipment email failed:", emailErr);
      }
    }

    if (order_status === "DELIVERED") {
      try {
        await sendDeliveredNotification(updatedOrder);
        console.log("🎉 Delivered notification email sent");
      } catch (emailErr) {
        console.error("Delivered email failed:", emailErr);
      }
    }

    res.json({
      message: "Order status updated",
      order: updatedOrder
    });

  } catch (err) {

    console.error("Order status update failed:", err);

    res.status(500).json({
      message: "Failed to update order status"
    });
  }
});

module.exports = router;