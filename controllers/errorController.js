const AppError = require('../utils/appError');

// const handleJsonWebTokenExpiredError = () => new AppError('JWT Expired, login again', 400);

// const handleJWTError = (error) =>
//   new AppError('JWT error: invalid signature', 401);

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const text = err.errmsg;
  //console.log(text);

  const value = text.match(/dup key: (.*)/g)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  // "message": "E11000 duplicate key error collection: adlocal.companies index: name_1 dup key: { : \"The Cook and Pot\" }",
  return new AppError(message, 400);
};

// const handleValidationErrorDB = (err) => {
//   const errors = Object.values(err.errors).map((el) => el.message);

//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400);
// };

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      //st: err.consoleisOperational,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR', err);
    //let error = { ...err };
    //console.log(error.name);
    //console.log(err.isOperational);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!!!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    // const error = { ...err };
    // console.log(error.errors.shortDescription);

    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //let error = Object.assign(error);

    //console.log(error.constructor.name);
    //console.log(error.name)
    //console.log(err.message)

    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(err);
    //if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    // if (error.name === 'TokenExpiredError') error = handleJsonWebTokenExpiredError();
    //if (error.errors.shortDescription.name === 'ValidatorError') error = handleValidationErrorDB(error);
    // todo above

    sendErrorProd(err, res);
  }
};
