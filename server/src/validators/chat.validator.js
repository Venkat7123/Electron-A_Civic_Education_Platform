"use strict";

const { z } = require("zod");

const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long"),
  moduleContext: z.string().min(1, "moduleContext is required"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        message: z.string(),
      }),
    )
    .optional()
    .default([]),
});

module.exports = { chatMessageSchema };
