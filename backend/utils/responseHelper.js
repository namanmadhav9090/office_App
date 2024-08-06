/**
 * Send a success response.
 * @param {object} res - The response object.
 * @param {number} statusCode - The HTTP status code (default: 200).
 * @param {object} data - The response data (default: null).
 * @param {string} message - The response message (default: 'Success').
 */
const sendResponse = (res, statusCode = 200, data = null, message = 'Success') => {
    res.status(statusCode).json({
      status: 'success',
      statusCode,
      message,
      data
    });
  };
  
  /**
   * Send an error response.
   * @param {object} res - The response object.
   * @param {number} statusCode - The HTTP status code (default: 500).
   * @param {string} message - The error message (default: 'An error occurred').
   * @param {object} errors - Additional error details (default: null).
   */
  const sendError = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
    res.status(statusCode).json({
      status: 'error',
      statusCode,
      message,
      errors
    });
  };
  
  module.exports = { sendResponse, sendError };
  