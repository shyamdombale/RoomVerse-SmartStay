const apiResponse = require('../utils/apiResponse');

const notFoundHandler = (req, res, next) => {
  return apiResponse.error(
    res,
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    [{ field: 'route', message: 'The requested API endpoint does not exist on RoomVerse server' }]
  );
};

module.exports = notFoundHandler;