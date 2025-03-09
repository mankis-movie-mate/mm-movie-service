const BaseError = require('./BaseError');

class NotFoundError extends BaseError {
  constructor(
    message = 'Resource not found.',
    userMessage = 'The requested resource does not exist.',
    suggestions = ['Please, check out your input and try again.']
  ) {
    super(404, 'NOT_FOUND_ERROR', message, userMessage, suggestions);
  }
}

module.exports = NotFoundError;
