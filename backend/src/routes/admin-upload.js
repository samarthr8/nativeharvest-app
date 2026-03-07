const express = require("express");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const auth = require("../middleware/auth");

const router = express.Router();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
});

const BUCKET = "nativeharvest-images";

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(400).json({ message: "Only JPEG, PNG, and WebP images are allowed" });
  }

  // Sanitize filename to prevent path traversal
  const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `products/${Date.now()}-${safeName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    })
  );

  const imageUrl = `https://${BUCKET}.s3.amazonaws.com/${key}`;

  res.json({ imageUrl });
});

module.exports = router;

