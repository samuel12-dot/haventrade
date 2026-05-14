export default function errorHandler(err, req, res, next) {
  let status  = err.statusCode || 500;
  let message = err.message    || 'Server error';

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already in use`;
    status = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map((e) => e.message).join(', ');
    status = 422;
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    message = `Invalid ${err.path}`;
    status = 400;
  }

  if (process.env.NODE_ENV !== 'production') console.error(err);

  res.status(status).json({ message });
}
