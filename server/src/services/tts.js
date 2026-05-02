"use strict";

const textToSpeech = require("@google-cloud/text-to-speech");

let _client = null;

function getClient() {
  if (!_client) {
    _client = new textToSpeech.TextToSpeechClient();
  }
  return _client;
}

/** Voice map as per AGENT.MD spec */
const VOICE_MAP = {
  "en-IN": { languageCode: "en-IN", name: "en-IN-Wavenet-A" },
  "hi-IN": { languageCode: "hi-IN", name: "hi-IN-Wavenet-A" },
  "ta-IN": { languageCode: "ta-IN", name: "ta-IN-Wavenet-C" },
  "te-IN": { languageCode: "te-IN", name: "te-IN-Wavenet-A" },
  "kn-IN": { languageCode: "kn-IN", name: "kn-IN-Wavenet-A" },
};

/**
 * Synthesize text to speech and return base64-encoded MP3.
 * @param {string} text
 * @param {string} language - one of the VOICE_MAP keys
 * @returns {Promise<string>} base64 encoded MP3
 */
async function synthesize(text, language) {
  // Graceful stub when credentials are missing (dev mode)
  if (
    !process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !process.env.GCP_PROJECT_ID
  ) {
    const stub = Buffer.from("stub-audio").toString("base64");
    return stub;
  }

  const voice = VOICE_MAP[language];
  if (!voice) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const client = getClient();
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice,
    audioConfig: { audioEncoding: "MP3" },
  });

  return response.audioContent.toString("base64");
}

module.exports = { synthesize };
