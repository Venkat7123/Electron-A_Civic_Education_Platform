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
  firestore: { FieldValue: { serverTimestamp: jest.fn() } },
}));

// ── Mock Firestore service ────────────────────────────────────────────────────
const mockGetProgress = jest.fn();
const mockUpdateProgress = jest.fn();

jest.mock("../src/services/firestore", () => ({
  getProgress: mockGetProgress,
  updateProgress: mockUpdateProgress,
  saveChatMessage: jest.fn(),
  getChatHistory: jest.fn(),
  getTtsCache: jest.fn(),
  setTtsCache: jest.fn(),
  getCertificate: jest.fn(),
  issueCertificate: jest.fn(),
  ensureUserProfile: jest.fn(),
  MODULE_IDS: ["module1", "module2", "module3", "module4"],
}));

const progressRouter = require("../src/routes/progress");
const { errorHandler } = require("../src/middleware/errorHandler");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/progress", progressRouter);
  app.use(errorHandler);
  return app;
}

const VALID_TOKEN = "Bearer valid-firebase-token";

describe("GET /api/progress", () => {
  let app;
  beforeAll(() => {
    app = buildApp();
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app).get("/api/progress");
    expect(res.status).toBe(401);
  });

  it("returns 200 with progress data", async () => {
    mockGetProgress.mockResolvedValueOnce({
      module1: { completed: true, score: 90, unlockedAt: "2024-01-01" },
      module2: { completed: false, score: 0, unlockedAt: null },
      module3: { completed: false, score: 0, unlockedAt: null },
      module4: { completed: false, score: 0, unlockedAt: null },
    });
    const res = await request(app)
      .get("/api/progress")
      .set("Authorization", VALID_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("module1");
  });
});

describe("POST /api/progress/:moduleId", () => {
  let app;
  beforeAll(() => {
    app = buildApp();
  });

  it("returns 401 when no auth header", async () => {
    const res = await request(app)
      .post("/api/progress/module1")
      .send({ completed: true, score: 85 });
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid moduleId", async () => {
    const res = await request(app)
      .post("/api/progress/module99")
      .set("Authorization", VALID_TOKEN)
      .send({ completed: true, score: 85 });
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid body (score out of range)", async () => {
    const res = await request(app)
      .post("/api/progress/module1")
      .set("Authorization", VALID_TOKEN)
      .send({ completed: true, score: 150 });
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing completed field", async () => {
    const res = await request(app)
      .post("/api/progress/module1")
      .set("Authorization", VALID_TOKEN)
      .send({ score: 85 });
    expect(res.status).toBe(400);
  });

  it("returns 200 on valid update", async () => {
    mockUpdateProgress.mockResolvedValueOnce(undefined);
    const res = await request(app)
      .post("/api/progress/module1")
      .set("Authorization", VALID_TOKEN)
      .send({ completed: true, score: 85 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });
});
