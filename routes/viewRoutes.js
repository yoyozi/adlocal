const express = require('express');

const viewController = require('../controllers/viewController');

const router = express.Router();

router.get('/', viewController.getListing);
router.get('/company/:slug', viewController.getCompany);


module.exports = router;
