const BaseError = require('./BaseError');

class InvalidInputError extends BaseError {
  constructor(
    message = 'Invalid input provided. Please check the request input.',
    userMessage = 'The information you entered is not valid. Please review and try again.',
    suggestions = [
      'Ensure all required fields are filled correctly and follow the expected format.',
    ]
  ) {
    super(400, 'INVALID_INPUT_ERROR', message, userMessage, suggestions);
  }
}

module.exports = InvalidInputError;
