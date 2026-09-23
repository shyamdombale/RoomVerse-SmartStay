/**
 * Standardized API Response Helper for RoomVerse
 */
const apiResponse = {
  success: (res, data = null, message = 'Operation successful', statusCode = 200, meta = null) => {
    const payload = {
      success: true,
      message,
      data,
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  },

  error: (res, message = 'An error occurred', statusCode = 500, errors = []) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: Array.isArray(errors) ? errors : [errors],
    });
  },
};

module.exports = apiResponse;