const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyAdmin = require("../middleware/auth");

/* ADD PRODUCT */
router.post("/products", verifyAdmin, async (req, res) => {
  try {
    const { name, slug, price, image, images, variants, description, stock, category } = req.body;

    await db.query(
      `
      INSERT INTO products
      (name, slug, price, image, images, variants, description, stock, category)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
      [
        name,
        slug,
        price,
        image || null,
        images ? JSON.stringify(images) : null,
        variants ? JSON.stringify(variants) : null,
        description,
        stock || 0,
        category || 'Uncategorized'
      ]
    );

    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to add product" });
  }
});

/* UPDATE PRODUCT */
router.put("/products/:slug", verifyAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { name, price, image, images, variants, description, stock, category } = req.body;

    await db.query(
      `
      UPDATE products
      SET name = $1, price = $2, image = $3, images = $4, variants = $5, description = $6, stock = $7, category = $8
      WHERE slug = $9
      `,
      [
        name,
        price,
        image || null,
        images ? JSON.stringify(images) : null,
        variants ? JSON.stringify(variants) : null,
        description,
        stock || 0,
        category || 'Uncategorized',
        slug
      ]
    );

    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, message: "Product update failed" });
  }
});

/* UPDATE STOCK (Unchanged) */
router.patch("/products/:slug/stock", verifyAdmin, async (req, res) => {
  try {
    const { stock } = req.body;
    await db.query(`UPDATE products SET stock = $1 WHERE slug = $2`, [stock, req.params.slug]);
    res.json({ success: true, message: "Stock updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Stock update failed" });
  }
});

/* DELETE PRODUCT (Unchanged) */
router.delete("/products/:slug", verifyAdmin, async (req, res) => {
  try {
    await db.query(`DELETE FROM products WHERE slug = $1`, [req.params.slug]);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

/* ================= COUPON MANAGEMENT ================= */

/* GET ALL COUPONS */
router.get("/coupons", verifyAdmin, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM coupons ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to load coupons" });
  }
});

/* CREATE COUPON */
router.post("/coupons", verifyAdmin, async (req, res) => {
  try {
    const { code, discount_type, discount_value, min_cart_value } = req.body;
    await db.query(
      `INSERT INTO coupons (code, discount_type, discount_value, min_cart_value) VALUES ($1, $2, $3, $4)`,
      [code.toUpperCase(), discount_type, discount_value, min_cart_value || 0]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to create coupon (Code might already exist)" });
  }
});

/* TOGGLE COUPON STATUS */
router.patch("/coupons/:id/toggle", verifyAdmin, async (req, res) => {
  try {
    await db.query(`UPDATE coupons SET is_active = NOT is_active WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle coupon" });
  }
});

/* DELETE COUPON */
router.delete("/coupons/:id", verifyAdmin, async (req, res) => {
  try {
    await db.query(`DELETE FROM coupons WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete coupon" });
  }
});

module.exports = router;