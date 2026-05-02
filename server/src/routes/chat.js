"use strict";

const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const { chatRateLimiter } = require("../middleware/rateLimiter");
const { chatMessageSchema } = require("../validators/chat.validator");
const { generateReply } = require("../services/gemini");
const { saveChatMessage, getChatHistory } = require("../services/firestore");

const router = express.Router();

/**
 * POST /api/chat
 * Send a message to Electron AI and get a reply.
 */
router.post("/", verifyToken, chatRateLimiter, async (req, res, next) => {
  try {
    const parsed = chatMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          error: "Invalid request body",
          details: parsed.error.flatten(),
        });
    }

    const { message, moduleContext, history } = parsed.data;
    const uid = req.user.uid;

    // Get Gemini reply
    const reply = await generateReply(moduleContext, history, message);

    // Persist both messages to Firestore (non-blocking errors — don't fail the request)
    try {
      await saveChatMessage(uid, moduleContext, "user", message);
      await saveChatMessage(uid, moduleContext, "model", reply);
    } catch (_fsErr) {
      // Log but don't fail — chat still works even if persistence fails
    }

    return res.json({ reply });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/chat/history?moduleContext=module1
 * Fetch the last 20 messages for a given module.
 */
router.get("/history", verifyToken, async (req, res, next) => {
  try {
    const { moduleContext } = req.query;
    if (!moduleContext) {
      return res
        .status(400)
        .json({ error: "moduleContext query param is required" });
    }

    const history = await getChatHistory(req.user.uid, moduleContext);
    return res.json({ history });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
