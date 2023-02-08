const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

// function to sign the token
// const signToken = function(id) {
//   jwt.sign({ id: id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };

// This function creates the token and send it then makes sure cookie of the token is sent and that pw is not shown
const createSendToken = function(user, statusCode, res) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = { 
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 ), 
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

// Creates and saves the user account
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  // /generate and send the token using function
  createSendToken(newUser, 201, res)
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if eamil and pw exists and pw correct
  if (!email || !password) {
    // must stop loop with return
    return next(new AppError('Please provide email and password!', 400));
  }

  // Check that user actually exists and get not only email but the password to compare
  const user = await User.findOne({ email }).select('+password');

  // in model we create an instance method that returns true or false : correctPassword
  // MOVED below ----- const correct = await user.correctPassword(password, user.password);
  // If user and correct see above are true then we move on to login below

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid username or password', 401));
  }

  // generate token and send
  createSendToken(user, 200, res)

});

// Checking for token / auth
exports.protect = catchAsync(async (req, res, next) => {
  // Get the token passed to server
  let token; // making token available outside of code block
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //console.log(token)

  if (!token) {
    return next(
      new AppError('You are NOT logged in, please login to get access!', 401)
    );
  }

  // Verify the token : jwt.verify is async that tajekes in a callback, we use the built in utils promisify modules to make it return a promise
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);

    // Check if user still exists in collection using the user id in the decoded token
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(new AppError('User is no longer in existance!', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }
    // NB! we allocate currentUser to req.user - all steps in future use req.user
    req.user = currentUser;
  } catch (err) {
    return next(new AppError('You are not logged in please log in again', 401));
  }

  // By next we mean grant access to next route and cab use req.user
  next();
});

// To authorize based on roles we create a closure that gives access to roles to the function
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You dont have permissions to perform this action', 403)
      );
    }
    next();
  };
};

// Forgot password (get email and send token to email address to reset - handled below.)
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on submitted email.
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that email registered!', 404));
  }

  // Generate a random token  - use instance method called from model
  const resetToken = user.createPasswordResetToken();
  // now we need to save it into the DB. We deactivate all validators so we can just send the token to db
  await user.save({ validateBeforeSave: false });

  // Send reset token to email address
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password, submit a patch request with your new password and password confirmation to ${resetURL}\n If you didnt reset your password then please ignore this message.`;

  // We need to catch an error if sendMail fails, we then also meed to rollback the token and changes made
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10mins)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to requesting user.',
    });
  } catch (err) {
    user.PasswordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email could not be sent', 500));
  }
});

// Reset the password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get user using the token returned by user using the url/token combination. Encrypt token and compare
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
  if (hashedToken && hashedToken === User.findOne({ passwordResetToken: hashedToken }));

  // 2 Check that the token has not expired and there is a user if so: reset the password
  if (!user) {
    return next(new AppError('The token is invalid or has expired.', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined

  // 3 Update the changedPasswordAt field in the database
  await user.save(); // we want the validation to be done

  // 4 Log user in and issue JWT NBNBNB We also need to change the date when password was changed so it can invalidate pre dated jwt's.
  // This we, do as a pre save in the User.model
  createSendToken(user, 200, res)

});

// Update our own password
exports.updateMyPassword = catchAsync(async (req, res, next) => {

  // Get users password from collection
  const user = await User.findById(req.user.id).select('+password');
  // cannot use User.findByIdAndUpdate as it doesnt do validation!!!
  // so do it thus---

  // Use instance method to check currentPassword
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Passwords dont match', 401));
  }

  // If we here then update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  // Abave validated in the validator in schema

  // Save and validate
  await user.save();

  // login and send jwt
  createSendToken(user, 201, res)

});