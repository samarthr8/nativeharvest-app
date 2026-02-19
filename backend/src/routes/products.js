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
      COALESCE(stock,0) as stock
    FROM products
    ORDER BY id
    `
  );

  res.json(result.rows);
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
      COALESCE(stock,0) as stock
    FROM products 
    WHERE slug=$1
    `,
    [req.params.slug]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(result.rows[0]);
});

module.exports = router;