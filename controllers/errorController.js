
// ERROR HANDLER (by specifying 4 parameters Express knows its an error handler)

module.exports = (err, req, res, next) => {
  // we read the status code from the Express issued error if none then 500 or internal server error
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  })

}