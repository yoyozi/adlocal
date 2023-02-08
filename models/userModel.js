const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  phone: {
    type: String,
    validate: {
      validator: function(value) {
        return /^(\+27|0|27)\d{9}$/.test(value);
      },
      message: 'The phone number is not a valid South African phone number!'
    },
    required: [true, 'Phone number is required'],
  },
  email: {
    type: String,
    required: [true, 'Please tell us your email address!'],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, 'Please enter a valid email address!'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    // The validation below only works on SAVE and CREATE: not update.
    // Cannot use arrow function as we need "this"
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
});

// Indexing:
userSchema.index({ email: 1, name: 1, phone: 1 });

// Update passwordChangedAt date with now when the password is changed
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // We substract 1 second to ensure that the jwt token is issued after password change, so we minus 1000 milliseconds.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// We encrypt the pw in the bd and do this using presave middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // Hash pw with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

// Query middleware that stops users that are active: false to be shown in views using find like getAllUsers
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// userSchema.pre('findOne', function (next) {
//   this.findOne({ active: true });
//   next();
// });

// Instance method for pw compare called correctPassword (returns either true if good or false if not the same password)
userSchema.methods.correctPassword = async function (candidatePassword, pw) {
  return await bcrypt.compare(candidatePassword, pw);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

// using the buildin crypto node module - we jusr require it
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  // now we encrypt it to store it
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    
  this.passwordResetExpires = Date.now() + (10 * 60 * 1000);

  console.log({ resetToken }, this.passwordResetToken, this.passwordResetExpires);

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
