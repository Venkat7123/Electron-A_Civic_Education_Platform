"use strict";

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const admin = require("firebase-admin");

const { loadSecrets } = require("./services/secrets");
const { generalRateLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const chatRoutes = require("./routes/chat");
const progressRoutes = require("./routes/progress");
const ttsRoutes = require("./routes/tts");
const certificateRoutes = require("./routes/certificate");

async function bootstrap() {
  // 1. Load secrets (GCP Secret Manager in prod, .env in dev)
  await loadSecrets();

  // 2. Init Firebase Admin
  const firebaseConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
  };

  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    firebaseConfig.credential = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace escaped newlines in env var
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } else {
    // Use application default credentials (works on GCP / Cloud Run)
    firebaseConfig.credential = admin.credential.applicationDefault();
    logger.warn(
      "[firebase] No service account keys found — using application default credentials",
    );
  }

  if (!admin.apps.length) {
    admin.initializeApp(firebaseConfig);
  }

  // 3. Create Express app
  const app = express();

  // ── Security ────────────────────────────────────────────────────────────────
  app.use(helmet());

  const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:8080")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow requests with no origin (e.g. mobile apps, curl in dev)
        if (
          !origin ||
          allowedOrigins.includes(origin) ||
          allowedOrigins.includes("*")
        ) {
          return cb(null, true);
        }
        return cb(new Error(`CORS: origin ${origin} not allowed`));
      },
      credentials: true,
    }),
  );

  // ── Body parsing ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: "50kb" }));

  // ── Request logging (method + path + status + response time only) ───────────
  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      logger.info(
        `${req.method} ${req.path} ${res.statusCode} ${Date.now() - start}ms`,
      );
    });
    next();
  });

  // ── General rate limiter on all routes ──────────────────────────────────────
  app.use(generalRateLimiter);

  // ── Health check (no auth) ──────────────────────────────────────────────────
  app.get("/health", (_req, res) =>
    res.json({ status: "ok", env: process.env.NODE_ENV }),
  );

  // ── API Routes ──────────────────────────────────────────────────────────────
  app.use("/api/chat", chatRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/tts", ttsRoutes);
  app.use("/api/certificate", certificateRoutes);

  // ── 404 handler ─────────────────────────────────────────────────────────────
  app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

  // ── Centralized error handler ────────────────────────────────────────────────
  app.use(errorHandler);

  // 4. Start listening
  const PORT = parseInt(process.env.PORT || "3001", 10);
  app.listen(PORT, () => {
    logger.info(`🚀 Electron server running on http://localhost:${PORT}`);
    logger.info(`   NODE_ENV: ${process.env.NODE_ENV || "development"}`);
    logger.info(`   CORS: ${allowedOrigins.join(", ")}`);
  });

  return app;
}

bootstrap().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
