const logger = require('../utils/logger');

/**
 * Centralized error handling middleware.
 * @param {Error} err - The error object.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error stack for internal debugging
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

  // Determine the status code and message based on the error type
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send a standard error response
  res.status(statusCode).json({
    status: statusCode,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : message,
    // Optionally include a stack trace in non-production environments
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorHandler;
