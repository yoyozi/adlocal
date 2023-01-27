const mongoose = require('mongoose');
const dotenv = require('dotenv');
// dotenv configuration after npm dotenv install needs to be read before app.js
dotenv.config({ path: './config.env' });

const app = require('./app');

// to see the env variables
//console.log(process.env);

//MongoDB connect
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set('strictQuery', false);

const Connect = async () => {
  const url = process.env.DB_URL;

  try {
    await mongoose.connect(url, {
      authSource: process.env.DB_AUTHSOURCE,
      user: process.env.DB_USERNAME,
      pass: process.env.DB_PASSWORD,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Database is connected!');
  } catch (error) {
    console.log(error.stack);
    process.exit(1);
  }
};
Connect();

// const newCompany = new Company({
//   name: "The swamp thing",
//   address: "23 Thornton Road",
//   contact: "John solo",
//   mobile: "0618090565",
//   email: "sales@bumminess",
// });
// newCompany
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
