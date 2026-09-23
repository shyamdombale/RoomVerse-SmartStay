const config = require('../config/env');
const apiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error('[RoomVerse Error]', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || (config.isProduction ? [] : [err.stack]);

  return apiResponse.error(res, message, statusCode, errors);
};

module.exports = errorHandler;