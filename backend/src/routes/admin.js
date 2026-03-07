const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/login", (req, res) => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !JWT_SECRET) {
    return res.status(503).json({ message: "Admin login is not configured" });
  }

  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
});

module.exports = router;

