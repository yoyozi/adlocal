const Company = require('../models/companyModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Route handlers
exports.getAllCompanies = catchAsync(async (req, res) => {

    // EXECUTE QUERY
    const features = new APIFeatures(Company.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const companies = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      results: companies.length,
      data: {
        companies,
      },
    });
});

exports.getCompany = catchAsync(async (req, res, next) => {

  const company = await Company.findById(req.params.id);

  if(!company) {
    // Must use a return as we dont want the next to continue after this function , 
    // sends to err and globalErrorHandler
    return next(new AppError('No company found with that ID', 404)) 
  };

  res.status(200).json({
    status: 'success',
    data: {
      company,
    },
  });
});

exports.createCompany = catchAsync(async (req, res) => {
  const newCompany = await Company.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      company: newCompany,
    },
  });
});

exports.deleteCompany = catchAsync(async (req, res, next) => {

  if(!company) {
    // Must use a return as we dont want the next to continue after this function , 
    // sends to err and globalErrorHandler
    return next(new AppError('No company found with that ID', 404)) 
  };

  await Company.findByIdAndRemove(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateCompany = catchAsync(async (req, res) => {

  if(!company) {
    // Must use a return as we dont want the next to continue after this function , 
    // sends to err and globalErrorHandler
    return next(new AppError('No company found with that ID', 404)) 
  };

  const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      company,
    },
  });
});
