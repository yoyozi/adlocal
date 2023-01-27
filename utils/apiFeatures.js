// Creating a class called APIFeatures that does all filtering and pagination work
class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // One method for each of the filters......

  // Filtering
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // Remove the excluded fields from the query object
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advance filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    //let query = Company.find(JSON.parse(queryStr));

    // need to return the object to be able to chain to next
    return this;
  }

  // SORTING
  sort() {
    if (this.queryString.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // LIMITING or projecting
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      //this.query = this.query.select('-__v -createdAt'); hiding createdAt in schema
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // PAGINATION
  paginate() {
    // Get the page am/nd limits set by user or set defaults
    // we use --- query = query.skip(x).limit(y);
    // page=2 limit=2 (give me page two and limit 2 docs per page)
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    // number of docs to skip is determined by -
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;