export const errorHandler = (err, req, res, next) => {
  // Log the error for server-side debugging
  console.error(err);
  
  // Determine status code (default to 500)
  const statusCode = err.statusCode || 500;
  
  // Send standardized error response
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
