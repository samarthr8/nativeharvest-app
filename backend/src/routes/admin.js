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
   UPDATED: DASHBOARD STATS (Month Aggregation)
========================================= */
router.get("/dashboard-stats", async (req, res) => {
  try {
    const { month, year } = req.query;

    // 1. Lifetime stats (Always returned)
    const lifetimeRes = await db.query("SELECT COUNT(*) as total_orders, SUM(total_amount) as total_revenue FROM orders");
    const lifetime = {
      totalOrders: parseInt(lifetimeRes.rows[0].total_orders || 0),
      totalRevenue: parseFloat(lifetimeRes.rows[0].total_revenue || 0)
    };

    let selected = { orders: 0, revenue: 0, shipping: 0, discounts: 0, productSales: 0 };
    let dailyTrend = [];

    // 2. Selected Month stats (If month/year provided)
    if (month && year) {
      const monthRes = await db.query(
        `SELECT
          COUNT(*) as total_orders,
          SUM(total_amount) as net_revenue,
          SUM(shipping_fee) as shipping,
          SUM(discount_amount) as discounts
         FROM orders
         WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2`,
        [month, year]
      );

      const row = monthRes.rows[0];
      const rev = parseFloat(row.net_revenue || 0);
      const ship = parseFloat(row.shipping || 0);
      const disc = parseFloat(row.discounts || 0);

      selected = {
        orders: parseInt(row.total_orders || 0),
        revenue: rev,
        shipping: ship,
        discounts: disc,
        // Math: Net Revenue = Product Sales + Shipping - Discounts. So Product Sales = Net - Shipping + Discounts
        productSales: rev - ship + disc 
      };

      // 3. Daily Trend for the graph
      const trendRes = await db.query(
        `SELECT TO_CHAR(created_at, 'YYYY-MM-DD') as date, COUNT(*) as daily_orders
         FROM orders
         WHERE EXTRACT(MONTH FROM created_at) = $1 AND EXTRACT(YEAR FROM created_at) = $2
         GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD')
         ORDER BY TO_CHAR(created_at, 'YYYY-MM-DD') ASC`,
        [month, year]
      );
      
      dailyTrend = trendRes.rows.map(r => ({
        date: r.date,
        orders: parseInt(r.daily_orders || 0)
      }));
    }

    res.json({ lifetime, selected, dailyTrend });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
});

/* =========================================
   GST FILING CHECKLIST
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
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    await db.query(`INSERT INTO subscribers (email, source) VALUES ($1, 'newsletter') ON CONFLICT (email) DO NOTHING`, [email.toLowerCase()]);
    res.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("Subscription error:", err);
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

router.get("/subscribers", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM subscribers ORDER BY subscribed_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

router.post("/subscribers/blast", async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) return res.status(400).json({ message: "Subject and message are required" });

  try {
    const result = await db.query("SELECT email FROM subscribers");
    const emails = result.rows.map(row => row.email);
    if (emails.length === 0) return res.status(400).json({ message: "No subscribers found" });

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