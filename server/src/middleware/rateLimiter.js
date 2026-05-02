"use strict";

const rateLimit = require("express-rate-limit");

/** Per-user rate limiter for chat (20 req/min) */
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  keyGenerator: (req) => req.user?.uid || req.ip,
  message: {
    error: "Too many chat requests. Please wait a moment and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/** General rate limiter for all other routes (100 req/min) */
const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.uid || req.ip,
  message: { error: "Too many requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatRateLimiter, generalRateLimiter };
