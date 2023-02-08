const express = require('express');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xssSanitize = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
//const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const companyRouter = require('./routes/companyRoutes');
const userRouter = require('./routes/userRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

// Templating engine setup
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// serve static files
app.use(express.static(path.join(`${__dirname}/public`)));

// GLOBAL MIDDLEWARE
// Helmet middleware for protection
app.use(helmet())

// Log with Morgan when in dev not production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// To rate limit 100 requests from the same ip address in 1 hour
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from your IP address, try again in an hour!'
});
// Apply the limiter only to the '/api' routes
app.use('/api', limiter);

// Puts body onto/into request - allows req.body
// app.use(express.json()); and now we limit what it can hold in size
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Against XSS attacks
app.use(xssSanitize());

// Prevent parameter pollution
// app.use(hpp({
//   whitelist: [
//     'duration'
//   ]
// }));

// Test Middleware
// app.use((req, res, next) => {
//   //console.log("Hello from MW");
//   console.log(req.headers);
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
app.use('/', viewRouter);

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
