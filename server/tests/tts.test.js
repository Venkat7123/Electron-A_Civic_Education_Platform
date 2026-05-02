"use strict";

const request = require("supertest");
const express = require("express");

// ── Mock Firebase Admin ───────────────────────────────────────────────────────
jest.mock("firebase-admin", () => ({
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn(), applicationDefault: jest.fn() },
  auth: () => ({
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: "test-uid-123",
      email: "test@example.com",
      name: "Test User",
    }),
  }),
}));

// ── Mock TTS service ──────────────────────────────────────────────────────────
jest.mock("../src/services/tts", () => ({
  synthesize: jest.fn().mockResolvedValue("bW9ja0Jhc2U2NEF1ZGlv"), // "mockBase64Audio"
}));

// ── Mock Firestore service ────────────────────────────────────────────────────
const mockGetTtsCache = jest.fn();
const mockSetTtsCache = jest.fn().mockResolvedValue(undefined);

jest.mock("../src/services/firestore", () => ({
  getTtsCache: mockGetTtsCache,
  setTtsCache: mockSetTtsCache,
  getProgress: jest.fn(),
  updateProgress: jest.fn(),
  saveChatMessage: jest.fn(),
  getChatHistory: jest.fn(),
  getCertificate: jest.fn(),
  issueCertificate: jest.fn(),
  ensureUserProfile: jest.fn(),
  MODULE_IDS: ["module1", "module2", "module3", "module4"],
}));

const ttsRouter = require("../src/routes/tts");
const { errorHandler } = require("../src/middleware/errorHandler");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/tts", ttsRouter);
  app.use(errorHandler);
  return app;
}

const VALID_TOKEN = "Bearer valid-firebase-token";

describe("POST /api/tts", () => {
  let app;
  beforeAll(() => {
    app = buildApp();
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app)
      .post("/api/tts")
      .send({ text: "Hello", language: "en-IN" });
    expect(res.status).toBe(401);
  });

  it("returns 400 for unsupported language", async () => {
    const res = await request(app)
      .post("/api/tts")
      .set("Authorization", VALID_TOKEN)
      .send({ text: "Hello", language: "fr-FR" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing text", async () => {
    const res = await request(app)
      .post("/api/tts")
      .set("Authorization", VALID_TOKEN)
      .send({ language: "en-IN" });
    expect(res.status).toBe(400);
  });

  it("returns cached audio when cache hit", async () => {
    mockGetTtsCache.mockResolvedValueOnce({
      audio: "cachedBase64",
      language: "en-IN",
    });
    const res = await request(app)
      .post("/api/tts")
      .set("Authorization", VALID_TOKEN)
      .send({ text: "Cached text", language: "en-IN" });
    expect(res.status).toBe(200);
    expect(res.body.audio).toBe("cachedBase64");
  });

  it("synthesizes and returns audio on cache miss", async () => {
    mockGetTtsCache.mockResolvedValueOnce(null); // cache miss
    const res = await request(app)
      .post("/api/tts")
      .set("Authorization", VALID_TOKEN)
      .send({ text: "Jai Hind", language: "hi-IN" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("audio");
    expect(typeof res.body.audio).toBe("string");
  });
});
