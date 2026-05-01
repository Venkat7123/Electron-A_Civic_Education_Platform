"use strict";

const md5 = require("md5");
const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { ttsSchema } = require("../validators/tts.validator");
const { synthesize } = require("../services/tts");
const { getTtsCache, setTtsCache } = require("../services/firestore");

const router = express.Router();

/**
 * POST /api/tts
 * Convert text to speech. Returns base64 MP3.
 * Uses Firestore cache keyed by md5(text + language).
 */
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const parsed = ttsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
    }

    const { text, language } = parsed.data;
    const hash = md5(`${text}::${language}`);

    // Check Firestore cache first
    const cached = await getTtsCache(hash);
    if (cached) {
      return res.json({ audio: cached.audio });
    }

    // Synthesize with Google TTS
    const audio = await synthesize(text, language);

    // Store in cache (non-blocking)
    setTtsCache(hash, { audio, language }).catch(() => {});

    return res.json({ audio });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
