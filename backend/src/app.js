const express = require("express");
const cors = require("cors");

/* 🔐 NEW — Needed for Razorpay webhook */
const bodyParser = require("body-parser");

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

const app = express();

app.use(cors());

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
