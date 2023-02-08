const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const document = await Model.findByIdAndDelete(req.params.id);

  if (!document) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  
  const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(!document) {
    return next(new AppError('No document found with that ID', 404)) 
  }

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

exports.createOne = Model => catchAsync(async (req, res) => {
  const document = await Model.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      document,
    },
  });
});

exports.getOne = Model => catchAsync(async (req, res, next) => {

  const document = await Model.findById(req.params.id);

  if(!document) {

    return next(new AppError('No document found with that ID', 404)) 
  };

  res.status(200).json({
    status: 'success',
    data: {
      document,
    },
  });
});

exports.getAll = Model => catchAsync(async (req, res) => {

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      // adding the explain method allows us to see the stats on a query (indexing)
    // const document = await features.query.explain();
    const document = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestedTime,
      results: document.length,
      data: {
        document,
      },
    });
});

