const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

/* ADD PRODUCT */
router.post("/products", auth, async (req, res) => {
  const { name, slug, price, image, description } = req.body;

  await db.query(
    "INSERT INTO products (name, slug, price, image, description) VALUES ($1,$2,$3,$4,$5)",
    [name, slug, price, image, description]
  );

  res.json({ success: true });
});

/* UPDATE PRODUCT */
router.put("/products/:slug", auth, async (req, res) => {
  const { name, price, image, description } = req.body;

  await db.query(
    "UPDATE products SET name=$1, price=$2, image=$3, description=$4 WHERE slug=$5",
    [name, price, image, description, req.params.slug]
  );

  res.json({ success: true });
});

/* DELETE PRODUCT */
router.delete("/products/:slug", auth, async (req, res) => {
  await db.query(
    "DELETE FROM products WHERE slug=$1",
    [req.params.slug]
  );

  res.json({ success: true });
});

module.exports = router;

