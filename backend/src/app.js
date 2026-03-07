const express = require("express");
const cors = require("cors");

/* 🔐 NEW — Needed for Razorpay webhook */
const bodyParser = require("body-parser");

/* 📦 NEW — Needed to fetch the product image for WhatsApp */
const db = require("./config/db"); // <-- Verify this path matches your project structure!
const he = require("he");

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const adminProductRoutes = require("./routes/admin-products");
const adminUploadRoutes = require("./routes/admin-upload");
const orderRoutes = require("./routes/orders");
const adminOrderRoutes = require("./routes/admin-orders");
const paymentRoutes = require("./routes/payments");
const orderStatusRoutes = require("./routes/order-status");
const adminOrderStatusRoutes = require("./routes/admin-order-status");
const orderTrackingRoutes = require("./routes/order-tracking");

/* 🔐 NEW — Webhook route */
const webhookRoutes = require("./routes/webhooks");

// Startup validation for required environment variables
const REQUIRED_ENV = ["DB_PASSWORD", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
const OPTIONAL_ENV = ["RAZORPAY_KEY_ID", "RAZORPAY_KEY_SECRET", "RAZORPAY_WEBHOOK_SECRET", "EMAIL_USER", "EMAIL_PASS"];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: ${key} environment variable is required`);
    process.exit(1);
  }
}

for (const key of OPTIONAL_ENV) {
  if (!process.env[key]) {
    console.warn(`WARNING: ${key} is not set — related features will be disabled`);
  }
}

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",")
    : ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

/* ✅ CRITICAL — Raw body ONLY for webhook */
app.use(
  "/api/webhooks/razorpay",
  bodyParser.raw({ type: "application/json" })
);

/* Normal JSON parsing for rest */
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminUploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/orders", orderStatusRoutes);
app.use("/api/admin", adminOrderStatusRoutes);
app.use("/api/orders", orderTrackingRoutes);

/* 🔐 NEW — register webhook */
app.use("/api/webhooks", webhookRoutes);

/* ==============================================================
   NEW: WHATSAPP / SEO BOT RESPONSE ROUTE
============================================================== */
app.get("/api/seo/products/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await db.query("SELECT name, description, image, images FROM products WHERE slug = $1", [slug]);

    if (result.rowCount === 0) {
      return res.status(404).send("Product not found");
    }

    const product = result.rows[0];
    
    // Grab the best image for the preview card
    let productImg = "https://nativeharvest-images.s3.us-east-1.amazonaws.com/default-share-image.jpg";
    if (product.images && product.images.length > 0) {
      productImg = product.images[0];
    } else if (product.image) {
      productImg = product.image;
    }

    // Escape dynamic values to prevent XSS
    const safeName = he.escape(product.name || "");
    const safeDesc = he.escape(product.description || "");
    const safeImg = he.escape(productImg);
    const safeSlug = encodeURIComponent(slug);

    // Build a barebones HTML document specifically for the bot to read
    const botHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <title>${safeName} | NativeHarvest India</title>
          <meta name="description" content="${safeDesc}" />

          <meta property="og:title" content="${safeName} | NativeHarvest India" />
          <meta property="og:description" content="${safeDesc}" />
          <meta property="og:image" content="${safeImg}" />
          <meta property="og:url" content="https://www.nativeharvest.in/products/${safeSlug}" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="NativeHarvest India" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="${safeImg}" />
        </head>
        <body>
          <script>
            // If a real human somehow gets here, redirect them to the actual app
            window.location.href = "/products/${safeSlug}";
          </script>
        </body>
      </html>
    `;

    return res.send(botHtml);

  } catch (err) {
    console.error("SEO API Error:", err);
    return res.status(500).send("Server Error");
  }
});
/* ============================================================== */

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* only listen if not in test */
if (require.main === module) {
  app.listen(5000, () => {
    console.log("Backend running on port 5000");
  });
}

module.exports = app;