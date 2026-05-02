"use strict";

const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  progressSchema,
  MODULE_IDS,
} = require("../validators/progress.validator");
const { getProgress, updateProgress } = require("../services/firestore");

const router = express.Router();

/**
 * GET /api/progress
 * Get all module progress for the authenticated user.
 */
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const progress = await getProgress(req.user.uid);
    return res.json(progress);
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/progress/:moduleId
 * Update progress for a specific module.
 * If completed, automatically unlocks the next module.
 */
router.post("/:moduleId", verifyToken, async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    if (!MODULE_IDS.includes(moduleId)) {
      return res.status(400).json({
        error: `Invalid moduleId. Must be one of: ${MODULE_IDS.join(", ")}`,
      });
    }

    const parsed = progressSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          error: "Invalid request body",
          details: parsed.error.flatten(),
        });
    }

    await updateProgress(req.user.uid, moduleId, parsed.data);
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
