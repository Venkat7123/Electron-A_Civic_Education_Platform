"use strict";

const logger = require("../utils/logger");

/**
 * Centralized error handler middleware.
 * Catches all errors forwarded via next(err).
 * Never logs request body or tokens.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : "Internal server error";

  logger.error(`[${req.method}] ${req.path} → ${status}: ${err.message}`);

  return res.status(status).json({ error: message, code: status });
}

module.exports = { errorHandler };
