class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // stus depends on the statusCode - if it startswith a 4 (client error responses) its fail if any other its error.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;