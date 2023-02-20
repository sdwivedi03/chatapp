const Joi = require('joi');
const httpStatus = require('http-status');
const extract = require('../utils/extract');
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {

  const validSchema = extract(schema, ['params', 'query', 'body']);
  const object = extract(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
  .prefs({ errors: { label: 'key' } })
  .validate(object);
  
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
