"use strict";

const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

let client;

/**
 * Returns the latest version of a GCP Secret Manager secret.
 * @param {string} projectId
 * @param {string} secretName
 */
async function getSecret(projectId, secretName) {
  if (!client) {
    client = new SecretManagerServiceClient();
  }
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  const [version] = await client.accessSecretVersion({ name });
  return version.payload.data.toString("utf8").trim();
}

/**
 * Loads all required secrets into process.env.
 * In development (USE_SECRET_MANAGER=false), secrets come from .env already.
 * In production (USE_SECRET_MANAGER=true), they are fetched from GCP.
 */
async function loadSecrets() {
  if (process.env.USE_SECRET_MANAGER !== "true") {
    console.log("[secrets] Using local .env — skipping GCP Secret Manager");
    return;
  }

  const projectId = process.env.GCP_PROJECT_ID;
  if (!projectId) {
    throw new Error("GCP_PROJECT_ID must be set to use Secret Manager");
  }

  const secretKeys = [
    "GEMINI_API_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
  ];

  console.log("[secrets] Loading secrets from GCP Secret Manager...");
  await Promise.all(
    secretKeys.map(async (key) => {
      try {
        const value = await getSecret(projectId, key);
        process.env[key] = value;
      } catch (err) {
        console.error(`[secrets] Failed to load secret: ${key}`, err.message);
        throw err;
      }
    })
  );
  console.log("[secrets] All secrets loaded successfully");
}

module.exports = { loadSecrets };
