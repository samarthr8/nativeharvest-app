const express = require("express");
const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const auth = require("../middleware/auth");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const BUCKET = "nativeharvest-images";

router.post("/upload", auth, upload.single("image"), async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const key = `products/${Date.now()}-${file.originalname}`;

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

