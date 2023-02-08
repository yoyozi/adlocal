const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv configuration after npm dotenv install needs to be read before app.js
dotenv.config({ path: './config.env' });

const app = require('./app');

// Handling uncaughtExceptions
process.on('uncaughtException', err => {
  console.log(err.name, err.message)
  console.log('UNCAUGHT EXCEPTION, Shutting down server');
  process.exit(1);
});

// to see the env variables
//console.log(process.env);

//MongoDB connect
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

const Connect = async () => {
  const url = process.env.DB_URL;

  await mongoose.connect(url, {
    authSource: process.env.DB_AUTHSOURCE,
    user: process.env.DB_USERNAME,
    pass: process.env.DB_PASSWORD,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log('Database is connected!');
};
Connect();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

// Handling unhandledPromiss rejections i.e. bd connection failure
// process.on('UnhandledPromiseRejectionWarning')
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION, Shutting down server');
  // Let all connections close and then exit
  server.close(() => {
    process.exit(1);
  });
});

// Handling uncaughtExceptions taken to top of code so catches all uncaught exceptions
