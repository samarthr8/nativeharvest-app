const express = require("express");
const cors = require("cors");

const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");
const adminProductRoutes = require("./routes/admin-products");
const adminUploadRoutes = require("./routes/admin-upload");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminUploadRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});

