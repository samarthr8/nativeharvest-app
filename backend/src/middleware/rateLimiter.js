const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const keyGenerator = (req) => {
  return req.headers["x-real-ip"] || req.headers["x-forwarded-for"]?.split(",")[0] || ipKeyGenerator(req);
};

// Checkout route: Max 10 attempts per 15 minutes per IP
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many order attempts from this IP. Please try again in 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
});

// Coupon validation: Max 10 attempts per 15 minutes per IP
const couponLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many coupon attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
});

module.exports = { checkoutLimiter, couponLimiter };
