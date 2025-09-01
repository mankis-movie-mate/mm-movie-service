class BaseError extends Error {
  constructor(statusCode, errorName, message, userMessage, suggestions = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorName = errorName;
    this.message = message;
    this.userMessage = userMessage;
    this.suggestions = suggestions;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;
