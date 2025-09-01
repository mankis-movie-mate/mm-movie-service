const BaseError = require('./BaseError');

class DuplicateError extends BaseError {
  constructor(
    message = 'The item already exists. Duplicate entry is not allowed.',
    userMessage = 'This item already exists. Please check the input and try again.',
    suggestions = ['Check if the item already exists in the system.']
  ) {
    super(400, 'DUPLICATE_ERROR', message, userMessage, suggestions);
  }
}

module.exports = DuplicateError;
