/**
 * Central structured logger (winston) — replaces bare console.* across the engine.
 * JSON in production, pretty in development. Never logs full HTML or secrets.
 * @module src/logger
 */
const winston = require('winston');

const isProd = process.env.NODE_ENV === 'production';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProd ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProd ? winston.format.json() : winston.format.combine(winston.format.colorize(), winston.format.simple())
  ),
  defaultMeta: { service: 'complete-on-page-seo' },
  transports: [new winston.transports.Console()]
});

module.exports = logger;
