"use strict";

const { GoogleGenerativeAI } = require("@google/generative-ai");

let _genAI = null;

function getGenAI() {
  if (!_genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    _genAI = new GoogleGenerativeAI(apiKey);
  }
  return _genAI;
}

const MODULE_NAMES = {
  "module-1": "Introduction to Indian Elections",
  "module-2": "Voter Registration & Voter ID",
  "module-3": "EVM & Voting Process",
  "module-4": "Election Results & Government Formation",
  "dashboard": "Election Learning Dashboard",
};

/**
 * Build the system prompt for the given module context.
 */
function buildSystemPrompt(moduleContext) {
  const moduleName = MODULE_NAMES[moduleContext] || moduleContext;
  return `You are Electron, a friendly civic education assistant helping Indian citizens understand the election process.
The user is currently on: ${moduleName}.
Only answer questions related to Indian elections, voter registration, EVM machines, and civic processes.
Keep responses concise, friendly, and in simple language. Limit replies to 3–4 sentences unless the user asks for detail.
If the user writes in Tamil, Hindi, Telugu, or Kannada — respond in that same language.
If the question is unrelated to Indian elections or civic education, politely redirect back to the topic.`;
}

/**
 * Convert chat history array to Gemini Content[] format.
 * @param {Array<{role: string, message: string}>} history
 */
function formatHistory(history) {
  const formatted = history.map((h) => ({
    role: h.role === "user" ? "user" : "model",
    parts: [{ text: h.message }],
  }));

  // Gemini requires the first message in history to be from the 'user' role.
  // We strip any leading 'model' messages (like initial greetings) to avoid 500 errors.
  const firstUserIndex = formatted.findIndex(m => m.role === "user");
  return firstUserIndex === -1 ? [] : formatted.slice(firstUserIndex);
}

/**
 * Generate a reply from Gemini AI.
 * @param {string} moduleContext - e.g. "module1"
 * @param {Array} history - prior conversation messages
 * @param {string} userMessage - the latest user message
 * @returns {Promise<string>} - the model reply text
 */
async function generateReply(moduleContext, history, userMessage) {
  // Graceful stub when API key is missing (dev mode)
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "your-gemini-api-key") {
    return `[Dev mode] Gemini API key not set. Your question was: "${userMessage}"`;
  }

  try {
    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: buildSystemPrompt(moduleContext),
    });

    const formattedHistory = formatHistory(history);
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (err) {
    throw new Error(`Gemini API error: ${err.message}`);
  }
}

module.exports = { generateReply };
