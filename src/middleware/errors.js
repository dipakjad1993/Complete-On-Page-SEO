/**
 * Express error + 404 + request-id middleware.
 * @module src/middleware/errors
 */
const logger = require('../logger');

function requestId(req, res, next) {
  req.id = req.headers['x-request-id'] || Math.random().toString(36).slice(2, 10);
  res.setHeader('x-request-id', req.id);
  next();
}

function notFound(req, res) {
  res.status(404).json({ error: 'Not found: ' + req.path, docs: '/openapi.yaml' });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (logger && logger.error) {
    logger.error('request failed', { id: req && req.id, status, message: err.message });
  }
  if (res.headersSent) {
    return;
  }
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
}

module.exports = { requestId, notFound, errorHandler };
