"use strict";

const admin = require("firebase-admin");

let _db = null;

function db() {
  if (!_db) {
    _db = admin.firestore();
  }
  return _db;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

const MODULE_IDS = ["module1", "module2", "module3", "module4"];

/**
 * Fetch all module progress for a user.
 * Returns defaults for modules that don't exist yet.
 */
async function getProgress(uid) {
  const result = {};
  await Promise.all(
    MODULE_IDS.map(async (moduleId) => {
      const doc = await db()
        .collection("users")
        .doc(uid)
        .collection("progress")
        .doc(moduleId)
        .get();
      result[moduleId] = doc.exists
        ? doc.data()
        : { completed: false, score: 0, unlockedAt: null };
    })
  );
  // module1 is always unlocked
  if (!result.module1.unlockedAt) {
    result.module1.unlockedAt = new Date().toISOString();
  }
  return result;
}

/**
 * Update a single module's progress. If completed, unlock the next module.
 */
async function updateProgress(uid, moduleId, { completed, score }) {
  const progressRef = db()
    .collection("users")
    .doc(uid)
    .collection("progress")
    .doc(moduleId);

  await progressRef.set(
    { completed, score, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );

  // Unlock next module if this one is completed
  if (completed) {
    const idx = MODULE_IDS.indexOf(moduleId);
    if (idx !== -1 && idx < MODULE_IDS.length - 1) {
      const nextModule = MODULE_IDS[idx + 1];
      await db()
        .collection("users")
        .doc(uid)
        .collection("progress")
        .doc(nextModule)
        .set({ unlockedAt: new Date().toISOString() }, { merge: true });
    }
  }
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

/**
 * Save a single chat message to Firestore.
 */
async function saveChatMessage(uid, moduleContext, role, message) {
  await db()
    .collection("users")
    .doc(uid)
    .collection("chats")
    .add({
      role,
      message,
      moduleContext,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
}

/**
 * Fetch the last 20 chat messages for a given module context.
 */
async function getChatHistory(uid, moduleContext) {
  const snapshot = await db()
    .collection("users")
    .doc(uid)
    .collection("chats")
    .where("moduleContext", "==", moduleContext)
    .orderBy("timestamp", "desc")
    .limit(20)
    .get();

  const messages = snapshot.docs.map((doc) => doc.data()).reverse();
  return messages;
}

// ─── Certificate ──────────────────────────────────────────────────────────────

/**
 * Fetch the user's certificate document (if any).
 */
async function getCertificate(uid) {
  const doc = await db().collection("users").doc(uid).collection("certificate").doc("main").get();
  return doc.exists ? doc.data() : null;
}

/**
 * Issue a certificate for the user.
 */
async function issueCertificate(uid, data) {
  await db()
    .collection("users")
    .doc(uid)
    .collection("certificate")
    .doc("main")
    .set({ ...data, issuedAt: new Date().toISOString() });
}

// ─── TTS Cache ────────────────────────────────────────────────────────────────

/**
 * Fetch cached TTS audio by hash.
 */
async function getTtsCache(hash) {
  const doc = await db().collection("ttsCache").doc(hash).get();
  return doc.exists ? doc.data() : null;
}

/**
 * Store TTS audio in cache.
 */
async function setTtsCache(hash, { audio, language }) {
  await db()
    .collection("ttsCache")
    .doc(hash)
    .set({ audio, language, createdAt: new Date().toISOString() });
}

// ─── User Profile ─────────────────────────────────────────────────────────────

/**
 * Get or create a user profile doc.
 */
async function ensureUserProfile(uid, { email, name }) {
  const ref = db().collection("users").doc(uid);
  const doc = await ref.get();
  if (!doc.exists) {
    await ref.set({ uid, email, name, createdAt: new Date().toISOString() });
  }
}

module.exports = {
  getProgress,
  updateProgress,
  saveChatMessage,
  getChatHistory,
  getCertificate,
  issueCertificate,
  getTtsCache,
  setTtsCache,
  ensureUserProfile,
  MODULE_IDS,
};
