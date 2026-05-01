"use strict";

const { z } = require("zod");

const ttsSchema = z.object({
  text: z.string().min(1, "Text cannot be empty").max(5000, "Text too long"),
  language: z.enum(["en-IN", "hi-IN", "ta-IN", "te-IN", "kn-IN"]),
});

module.exports = { ttsSchema };
