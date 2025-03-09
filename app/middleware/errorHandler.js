const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    errorCode: statusCode,
    errorName: err.errorName || 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected error occured.',
    userMessage:
      err.userMessage || 'Something went wrong, please try again later.',
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
    suggestions: err.suggestions || [],
  });
};

module.exports = errorHandler;
