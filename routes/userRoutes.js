const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);
    
router
    .route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;