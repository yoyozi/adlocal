const Company = require('../models/companyModel');
const catchAsync = require('../utils/catchAsync');

// This is our UI landing page
exports.getListing = catchAsync(async (req, res, next) => {
  // 1 Get all the companies
  const companies = await Company.find();

  res.status(200).render('listing', {
    title: 'All Companies',
    companies,
  });
});

// The second UI page from link above
exports.getCompany = catchAsync(async (req, res) => {
  const company = await Company.findOne({ slug: req.params.slug });

  console.log(company);


  res.status(200).render('company', {
    title: company.name,
    company
  });
});
