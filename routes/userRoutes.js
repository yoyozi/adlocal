const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// All routes below get protect
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updateMyPassword);
router.patch('/updateMe', userController.updateMe);
router.get('/me',  userController.getMe, userController.getUser);
router.delete('/deleteMe', userController.deleteMe);

// All the routes below this wil be restricted to 'admin'
router.use(authController.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers)
    
router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;