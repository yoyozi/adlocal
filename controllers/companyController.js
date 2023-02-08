const Company = require('../models/companyModel');
const factory = require('./handlerFactory');

//const AppError = require('../utils/appError');
//const catchAsync = require('../utils/catchAsync');

// Factory handlers
exports.deleteCompany = factory.deleteOne(Company);
exports.updateCompany = factory.updateOne(Company);
exports.createCompany = factory.createOne(Company);
exports.getCompany = factory.getOne(Company);
exports.getAllCompanies = factory.getAll(Company);

// // Route handlers
// exports.getAllCompanies = catchAsync(async (req, res) => {

//     // EXECUTE QUERY
//     const features = new APIFeatures(Company.find(), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate();
//     const companies = await features.query;

//     res.status(200).json({
//       status: 'success',
//       requestedAt: req.requestedTime,
//       results: companies.length,
//       data: {
//         companies,
//       },
//     });
// });

// exports.getCompany = catchAsync(async (req, res, next) => {

//   const company = await Company.findById(req.params.id);

//   // below is with a populate if not done as Middleware and only on a 
//   // route handler see model for pre middleware where its done for all
//   // const company = await Company.findById(req.params.id).populate({
//   //   path: 'contact',
//   //   select: '-__v -passwordChangedAt'
//   // });

//   if(!company) {
//     // Must use a return as we dont want the next to continue after this function , 
//     // sends to err and globalErrorHandler
//     return next(new AppError('No company found with that ID', 404)) 
//   };

//   res.status(200).json({
//     status: 'success',
//     data: {
//       company,
//     },
//   });
// });

// exports.createCompany = catchAsync(async (req, res) => {
//   const newCompany = await Company.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       company: newCompany,
//     },
//   });
// });
  
// exports.deleteCompany = catchAsync(async (req, res, next) => {
  
//   const company = await Company.findByIdAndDelete(req.params.id);

//   if (!company) {
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

// exports.updateCompany = catchAsync(async (req, res, next) => {
  
//   const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if(!company) {
//     return next(new AppError('No company found with that ID', 404)) 
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       company,
//     },
//   });
// });
