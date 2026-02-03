const express = require("express");
const router = express.Router();
const db = require("../config/db");
const getRazorpayInstance = require("../config/razorpay");

/*
 POST /api/payments/create
 Body: { order_id }
*/
router.post("/create", async (req, res) => {
  try {
    const { order_id } = req.body;

    const result = await db.query(
      "SELECT * FROM orders WHERE order_id = $1",
      [order_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = result.rows[0];

    if (order.payment_status === "PAID") {
      return res.status(400).json({ message: "Order already paid" });
    }

    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      return res.status(500).json({ message: "Payments disabled in test mode" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.total_amount * 100,
      currency: "INR",
      receipt: order.order_id,
      payment_capture: 1
    });

    await db.query(
      "UPDATE orders SET razorpay_order_id = $1 WHERE order_id = $2",
      [razorpayOrder.id, order.order_id]
    );

    res.json({
      razorpay_order_id: razorpayOrder.id,
      amount_paise: razorpayOrder.amount,
      amount_rupees: razorpayOrder.amount / 100,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

module.exports = router;
