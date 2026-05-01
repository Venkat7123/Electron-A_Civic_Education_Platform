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
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        collection: jest.fn(() => ({
          add: jest.fn().mockResolvedValue({}),
          where: jest.fn(() => ({
            orderBy: jest.fn(() => ({
              limit: jest.fn(() => ({
                get: jest.fn().mockResolvedValue({ docs: [] }),
              })),
            })),
          })),
        })),
        get: jest.fn().mockResolvedValue({ exists: false }),
      })),
    })),
  })),
}));

// ── Mock Gemini service ───────────────────────────────────────────────────────
jest.mock("../src/services/gemini", () => ({
  generateReply: jest.fn().mockResolvedValue("This is a mock Gemini reply about Indian elections."),
}));

// ── Mock Firestore service ────────────────────────────────────────────────────
jest.mock("../src/services/firestore", () => ({
  saveChatMessage: jest.fn().mockResolvedValue(undefined),
  getChatHistory: jest.fn().mockResolvedValue([
    { role: "user", message: "What is an EVM?", moduleContext: "module3", timestamp: null },
    { role: "model", message: "EVM stands for Electronic Voting Machine.", moduleContext: "module3", timestamp: null },
  ]),
  getProgress: jest.fn(),
  updateProgress: jest.fn(),
  getTtsCache: jest.fn(),
  setTtsCache: jest.fn(),
  getCertificate: jest.fn(),
  issueCertificate: jest.fn(),
  ensureUserProfile: jest.fn(),
  MODULE_IDS: ["module1", "module2", "module3", "module4"],
}));

const chatRouter = require("../src/routes/chat");
const { errorHandler } = require("../src/middleware/errorHandler");

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use("/api/chat", chatRouter);
  app.use(errorHandler);
  return app;
}

const VALID_TOKEN = "Bearer valid-firebase-token";

describe("POST /api/chat", () => {
  let app;
  beforeAll(() => { app = buildApp(); });

  it("returns 401 when no Authorization header", async () => {
    const res = await request(app).post("/api/chat").send({
      message: "What is an election?",
      moduleContext: "module1",
      history: [],
    });
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing message field", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Authorization", VALID_TOKEN)
      .send({ moduleContext: "module1", history: [] });
    expect(res.status).toBe(400);
  });

  it("returns 400 for empty message", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Authorization", VALID_TOKEN)
      .send({ message: "", moduleContext: "module1", history: [] });
    expect(res.status).toBe(400);
  });

  it("returns 200 with reply on valid request", async () => {
    const res = await request(app)
      .post("/api/chat")
      .set("Authorization", VALID_TOKEN)
      .send({ message: "What is an election?", moduleContext: "module1", history: [] });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("reply");
    expect(typeof res.body.reply).toBe("string");
  });
});

describe("GET /api/chat/history", () => {
  let app;
  beforeAll(() => { app = buildApp(); });

  it("returns 401 when no Authorization header", async () => {
    const res = await request(app).get("/api/chat/history?moduleContext=module1");
    expect(res.status).toBe(401);
  });

  it("returns 400 when moduleContext is missing", async () => {
    const res = await request(app)
      .get("/api/chat/history")
      .set("Authorization", VALID_TOKEN);
    expect(res.status).toBe(400);
  });

  it("returns 200 with history array", async () => {
    const res = await request(app)
      .get("/api/chat/history?moduleContext=module3")
      .set("Authorization", VALID_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("history");
    expect(Array.isArray(res.body.history)).toBe(true);
  });
});
