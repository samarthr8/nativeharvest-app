const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/auth");

/* ADD PRODUCT */
router.post("/products", verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      slug,
      price,
      image,
      images,
      variants,
      description,
      stock
    } = req.body;

    await db.query(
      `
      INSERT INTO products
      (name, slug, price, image, images, variants, description, stock)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        name,
        slug,
        price,
        image || null,
        images ? JSON.stringify(images) : null,
        variants ? JSON.stringify(variants) : null,
        description,
        stock || 0
      ]
    );

    res.json({
      success: true,
      message: "Product added successfully"
    });

  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to add product"
    });
  }
});

/* ================= UPDATE PRODUCT (NEW) ================= */
router.put("/products/:slug", verifyAdmin, async (req, res) => {
  try {

    const { slug } = req.params;

    const {
      name,
      price,
      image,
      images,
      variants,
      description,
      stock
    } = req.body;

    await db.query(
      `
      UPDATE products
      SET name = $1,
          price = $2,
          image = $3,
          images = $4,
          variants = $5,
          description = $6,
          stock = $7
      WHERE slug = $8
      `,
      [
        name,
        price,
        image || null,
        images ? JSON.stringify(images) : null,
        variants ? JSON.stringify(variants) : null,
        description,
        stock || 0,
        slug
      ]
    );

    res.json({
      success: true,
      message: "Product updated successfully"
    });

  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Product update failed"
    });
  }
});

/* UPDATE STOCK */
router.patch("/products/:slug/stock", verifyAdmin, async (req, res) => {
  try {
    const { stock } = req.body;

    await db.query(
      `
      UPDATE products
      SET stock = $1
      WHERE slug = $2
      `,
      [stock, req.params.slug]
    );

    res.json({
      success: true,
      message: "Stock updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Stock update failed"
    });
  }
});

/* DELETE PRODUCT */
router.delete("/products/:slug", verifyAdmin, async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM products
      WHERE slug = $1
      `,
      [req.params.slug]
    );

    res.json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Delete failed"
    });
  }
});

module.exports = router;