const express = require("express");
const crypto = require("crypto");
const db = require("../config/db");

const router = express.Router();

router.post("/razorpay", async (req, res) => {

  console.log("🔥 Razorpay webhook received");

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  // 🔥 FORCE RAW BUFFER
  const rawBody = Buffer.isBuffer(req.body)
    ? req.body
    : Buffer.from(JSON.stringify(req.body));

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("❌ Invalid Razorpay webhook signature");
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(rawBody.toString());

  console.log("Event:", event.event);

  if (event.event === "payment.captured") {

    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    try {

      await db.query(`
        UPDATE orders
        SET payment_status = 'PAID'
        WHERE razorpay_order_id = $1
        AND payment_status != 'PAID'
      `, [razorpayOrderId]);

      console.log("✅ Payment verified:", razorpayOrderId);

    } catch (err) {

      console.error("DB update failed", err);
      return res.status(500).send("DB error");

    }
  }

  res.json({ status: "ok" });
});

module.exports = router;
