const express = require("express");
const crypto = require("crypto");
const db = require("../config/db");

/* 🔥 UPDATED: Added sendAdminNotification */
const { 
  sendOrderConfirmation,
  sendAdminNotification
} = require("../services/emailService");

const router = express.Router();

router.post("/razorpay", async (req, res) => {
  try {

    console.log("Webhook hit from IP:", req.headers["x-forwarded-for"] || req.socket.remoteAddress);
    console.log("🔥 Razorpay webhook received");

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("❌ Missing RAZORPAY_WEBHOOK_SECRET");
      return res.status(500).send("Webhook secret not configured");
    }

    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
      console.error("❌ Missing Razorpay signature header");
      return res.status(400).send("Missing signature");
    }

    /**
     * VERY IMPORTANT:
     * req.body MUST be raw buffer
     */
    const rawBody = req.body;

    if (!Buffer.isBuffer(rawBody)) {
      console.error("❌ Webhook body is not a buffer");
      return res.status(400).send("Invalid body format");
    }
    
    console.log("Body is buffer:", Buffer.isBuffer(req.body));
    console.log("Content-Type:", req.headers["content-type"]);

    // 🔐 Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    // 🔐 Compare signatures safely
    if (!crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    )) {
      console.error("❌ Invalid Razorpay webhook signature");
      return res.status(400).send("Invalid signature");
    }

    console.log("✅ Signature verified");
    console.log("Razorpay signature:", signature);
    console.log("Expected signature:", expectedSignature);

    // Parse event AFTER verification
    const event = JSON.parse(rawBody.toString());

    console.log("Event:", event.event);

    /**
     * PAYMENT CAPTURED
     */
    if (event.event === "payment.captured") {

      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      console.log("Processing payment for:", razorpayOrderId);

      /**
       * 🔥 UPDATED:
       * Added customer_name in RETURNING
       */
      const result = await db.query(`
        UPDATE orders
        SET payment_status = 'PAID'
        WHERE razorpay_order_id = $1
        AND payment_status != 'PAID'
        RETURNING order_id, email, total_amount, customer_name;
      `, [razorpayOrderId]);

      if (result.rowCount === 0) {

        console.log("ℹ️ Order already updated or not found.");

      } else {

        console.log("✅ Payment marked PAID for order:", result.rows[0].order_id);

        try {

          const order = result.rows[0];

          /* 🔥 EXISTING FEATURE */
          await sendOrderConfirmation(order);
          console.log("📧 Order confirmation email sent successfully");

          /* 🔥 NEW FEATURE: Admin Notification */
          await sendAdminNotification(order);
          console.log("📩 Admin notification email sent successfully");

        } catch (emailErr) {

          console.error("❌ Email sending failed:", emailErr);

          // IMPORTANT:
          // Do NOT throw error.
          // Webhook must not fail because email failed.
        }
      }
    }

    res.json({ status: "ok" });

  } catch (err) {

    console.error("🔥 Webhook handler crashed:", err);

    res.status(200).send("Received");
  }
});

module.exports = router;
