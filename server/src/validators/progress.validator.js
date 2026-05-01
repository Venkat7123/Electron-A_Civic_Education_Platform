"use strict";

const { z } = require("zod");

const progressSchema = z.object({
  completed: z.boolean(),
  score: z.number().min(0).max(100),
});

const MODULE_IDS = ["module1", "module2", "module3", "module4"];

module.exports = { progressSchema, MODULE_IDS };
