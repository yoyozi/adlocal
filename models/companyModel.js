const mongoose = require('mongoose');
const slugify = require('slugify');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Must have a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Must have less than 40 characters'],
    minlength: [6, 'Must have more than 6 characters'],
    // validate: [validator.isAlpha, 'Tour name must only contain characters']
  },
  contact: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Company must be managed by a user']
  },
  slug: String,
  address: {
    type: String,
    required: [true, 'Must have an address'],
  },
  website: {
    type: String,
  },
  shortDescription: {
    type: String,
    trim: true,
    maxlength: [40, 'ShortDescription must have less than 40 characters'],
    minlength: [10, 'ShortDescription must have more than 10 characters'],
    default: 'Fantastic Pets',
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: [200, 'Must have less than 200 characters'],
    minlength: [30, 'Must have more than 30 characters'],
    default:
      'The pet shop catering for birds, reptiles, fish and the odd puppy',
  },
  logo: {
    type: String,
    trim: true,
    default: 'default-logo.jpg',
  },
  image: {
    type: String,
    trim: true,
    default: 'default-image.jpg',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
      marker: String,
    },
  },
});



// Document middleware in mongoose allows us to get pre and post hooks
// The this is the document  and pre save create a slug of the name of company
companySchema.pre('save', function (next) {
  // Lets print before saving the document
  //console.log(this);

  // Create a slug of the name of company (need an entry in the model!)
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Populate all queries that use find with the contacts details except for the select minus ones
companySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'contact',
    select: '-__v -passwordChangedAt'
  })
  next();
});

// companySchema.post('save', function (doc, next) {
//   // Lets print after saving the document
//   console.log(doc);
//   next();
// });

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
