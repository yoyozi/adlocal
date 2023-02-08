const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// functions filteredObjsct
const filterObj = (obj,...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
};

// Factory handlers
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User); // NOT FOR PASSWORD UPDATING!!! validation
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// using getOne after getMe but need to change id source
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id
  next();
};

// Route handlers
// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// Done be setting the "Boolen" called active to false by default is true
exports.deleteMe = catchAsync(async(req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  res.status(204).json({
    status:'success',
    data: null
  })
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Create an error if user tries to update the password here
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for updating password, please use updateMyPassword instead.',
        400
        )
        );
      }
      
      const filteredBody = filterObj(req.body, 'name', 'email', 'phone');
      const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    validators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      name: user.name,
      email: user.email,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'Endpoint not defined - please use signup instead!',
  });
});



