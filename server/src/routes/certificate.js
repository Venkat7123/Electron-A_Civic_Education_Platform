"use strict";

const express = require("express");
const { verifyToken } = require("../middleware/verifyToken");
const {
  getProgress,
  getCertificate,
  issueCertificate,
} = require("../services/firestore");

const router = express.Router();

const REQUIRED_MODULES = ["module1", "module2", "module3", "module4"];

/**
 * POST /api/certificate
 * Issue a completion certificate if all 4 modules are completed.
 */
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const uid = req.user.uid;

    // Check all modules are completed
    const progress = await getProgress(uid);
    const allCompleted = REQUIRED_MODULES.every(
      (m) => progress[m] && progress[m].completed === true,
    );

    if (!allCompleted) {
      return res.status(403).json({
        error:
          "All 4 modules must be completed before a certificate can be issued",
      });
    }

    // Check if already issued
    const existing = await getCertificate(uid);
    if (existing) {
      return res.json(existing);
    }

    // Issue new certificate
    const completedModules = REQUIRED_MODULES.map((m) => ({
      moduleId: m,
      score: progress[m].score || 0,
    }));

    const certData = {
      userName: req.user.name,
      completedModules,
      issuedAt: new Date().toISOString(),
    };

    await issueCertificate(uid, certData);
    return res.json(certData);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
