const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Company = require('../models/companyModel');

dotenv.config({ path: './config.env' });

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

// COMPANIES
// Read the JSON file in
const companies = JSON.parse(
  fs.readFileSync(`${__dirname}/companies.json`, 'utf-8')
);

// Import data into the DB
const importData = async () => {
  try {
    await Company.create(companies);
    console.log('The companies imported successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

// Delete all data collections
const deleteData = async () => {
  try {
    await Company.deleteMany();
    console.log('The companies were deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit(0);
};

if (process.argv[2] === '--import') {
  importData();
  } else if (process.argv[2] === '--delete') {
  deleteData();
};
