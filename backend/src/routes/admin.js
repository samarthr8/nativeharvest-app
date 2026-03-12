const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../config/db"); 
const { sendPromotionalBlast } = require("../services/emailService"); 

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nativeharvest.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "nativeharvestsecret";

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

/* =========================================
   NEW: DASHBOARD STATS (Fixes 100 Limit Bug)
========================================= */
router.get("/dashboard-stats", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders"
    );
    res.json({
      totalOrders: parseInt(result.rows[0].total_orders || 0),
      totalRevenue: parseFloat(result.rows[0].total_revenue || 0)
    });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

/* =========================================
   NEW: GST FILING CHECKLIST
========================================= */
router.get("/gst-status", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM gst_filings");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch GST status" });
  }
});

router.post("/gst-status", async (req, res) => {
  const { month_year, is_filed } = req.body;
  try {
    await db.query(
      `INSERT INTO gst_filings (month_year, is_filed) VALUES ($1, $2)
       ON CONFLICT (month_year) DO UPDATE SET is_filed = EXCLUDED.is_filed`,
      [month_year, is_filed]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("GST update error:", err);
    res.status(500).json({ message: "Failed to update GST status" });
  }
});

/* =========================================
   NEWSLETTER & SUBSCRIBER ROUTES
========================================= */

// Public route to handle newsletter signups from the Home page
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    await db.query(
      `INSERT INTO subscribers (email, source) VALUES ($1, 'newsletter') ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase()]
    );
    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

// Admin route to fetch all subscribers
router.get("/subscribers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM subscribers ORDER BY subscribed_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

// Admin route to send promotional blast
router.post("/subscribers/blast", async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required" });
  }

  try {
    const result = await db.query("SELECT email FROM subscribers");
    const emails = result.rows.map(row => row.email);

    if (emails.length === 0) {
      return res.status(400).json({ message: "No subscribers found" });
    }

    // Format the message nicely for email
    const htmlContent = `
      <div style="font-family: sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        ${message.replace(/\n/g, '<br/>')}
        <br/><br/>
        <p>Thank you for being part of the NativeHarvest family! 🌾</p>
        <a href="https://nativeharvest.store" style="color: #2f6f4e; text-decoration: underline;">Visit our store</a>
      </div>
    `;

    await sendPromotionalBlast(emails, subject, htmlContent);
    res.json({ success: true, count: emails.length });
  } catch (err) {
    console.error("Email blast error:", err);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

module.exports = router;