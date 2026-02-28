const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* GET ALL PRODUCTS */
router.get("/", async (req, res) => {
  const result = await db.query(
    `
    SELECT 
      name,
      slug,
      price,
      image,
      images,
      variants,
      description,
      category, 
      COALESCE(stock,0) as stock
    FROM products
    ORDER BY id
    `
  );

  const products = result.rows.map(p => ({
    ...p,
    images: p.images || [],
    variants: p.variants || []
  }));

  res.json(products);
});

/* GET PRODUCT BY SLUG */
router.get("/:slug", async (req, res) => {
  const result = await db.query(
    `
    SELECT 
      name,
      slug,
      price,
      image,
      images,
      variants,
      description,
      category,
      COALESCE(stock,0) as stock
    FROM products 
    WHERE slug=$1
    `,
    [req.params.slug]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  const product = result.rows[0];

  res.json({
    ...product,
    images: product.images || [],
    variants: product.variants || []
  });
});

module.exports = router;