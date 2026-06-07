// d:\projects\personal-projects\to-do-list\server\src\middleware\error.middleware.js

/**
 * Global Error Handler Middleware
 * Every error thrown in our routes will eventually end up here.
 */
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.message);

  // If the error has a status code (like 404 or 400), use it. Otherwise default to 500 (Server Error).
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // We only show the full stack trace in development, to hide internals from users
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = errorHandler;
