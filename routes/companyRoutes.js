const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();
const companyController = require('../controllers/companyController');

router
  .route('/')
  .get(companyController.getAllCompanies)
  .post(authController.protect, authController.restrictTo('admin'), companyController.createCompany);

router
  .route('/:id')
  .get(companyController.getCompany)
  .delete(authController.protect, authController.restrictTo('admin'), companyController.deleteCompany)
  .patch(authController.protect, authController.restrictTo('admin'), companyController.updateCompany);

module.exports = router;
