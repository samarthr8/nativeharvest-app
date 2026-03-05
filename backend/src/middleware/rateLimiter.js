const rateLimit = require("express-rate-limit");

// Bouncer for the checkout route: Max 10 attempts per 15 minutes per IP
const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: {
    success: false,
    message: "Too many order attempts from this IP. Please try again in 15 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Nginx reverse proxy compatibility: 
  // This ensures the limiter reads the real user's IP from Nginx, not the Docker container's IP.
  keyGenerator: (req) => {
    return req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.ip;
  }
});

module.exports = { checkoutLimiter };
