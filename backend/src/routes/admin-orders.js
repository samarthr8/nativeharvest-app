const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

router.get("/orders", auth, async (req, res) => {
  const result = await db.query(
    "SELECT * FROM orders ORDER BY created_at DESC"
  );
  res.json(result.rows);
});

module.exports = router;
