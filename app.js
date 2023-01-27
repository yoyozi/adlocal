const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const companyRouter = require('./routes/companyRoutes');
const userRouter = require("./routes/userRoutes");

const app = express();

// Global-Middleware
// Log with Morgan when in dev not production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Puts body onto/into request
app.use(express.json());

// serve statics
//app.use(express.static(`${__dirname}/public`));

// Next Middleware
// app.use((req, res, next) => {
//   console.log("Hello from MW");
//   next();
// });

// Next Middleware
app.use((req, res, next) => {
  // We add to req object -
  req.requestTime = new Date().toISOString();
  next();
});

// Mount routes
app.use('/api/v1/companies', companyRouter);
app.use('/api/v1/users', userRouter);

// Catchall routes not handled above (is all as its catching GET, POST, PATCH, DEL, PUT ....)
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cannot find ${req.originalUrl} on this server!`
  // })

  // const err = new Error(`Cannot find ${req.originalUrl} on this server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  // Must set next and when we give it error then its going to go to the err handler below.
  //next(err);

  // Using the AppError class instead, we pass it message and status code.
  next(new AppError(`Cannot find ${req.originalUrl} on this server!`, '404'));

});

// migrated to controller as globalErrorHandler.
app.use(globalErrorHandler);



module.exports = app;
