const express = require("express");
const crypto = require("crypto");
const db = require("../config/db");

const router = express.Router();

router.post("/razorpay", async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    try {
      await db.query(
        `
        UPDATE orders
        SET payment_status = 'PAID'
        WHERE razorpay_order_id = $1
        `,
        [razorpayOrderId]
      );

      console.log("✅ Payment verified for order:", razorpayOrderId);
    } catch (err) {
      console.error("DB update failed", err);
      return res.status(500).send("DB error");
    }
  }

  res.json({ status: "ok" });
});

module.exports = router;
