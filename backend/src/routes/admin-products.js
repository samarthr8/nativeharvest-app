const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/auth");

/* ADD PRODUCT */
router.post("/products", verifyAdmin, async (req, res) => {

  const { name, slug, price, image, description, stock } = req.body;

  await db.query(
    `
    INSERT INTO products
    (name, slug, price, image, description, stock)
    VALUES ($1,$2,$3,$4,$5,$6)
    `,
    [name, slug, price, image, description, stock || 0]
  );

  res.json({ message: "Product added" });
});

/* UPDATE STOCK */
router.patch("/products/:slug/stock", verifyAdmin, async (req, res) => {

  const { stock } = req.body;

  await db.query(
    `
    UPDATE products
    SET stock = $1
    WHERE slug = $2
    `,
    [stock, req.params.slug]
  );

  res.json({ message: "Stock updated" });
});

module.exports = router;
