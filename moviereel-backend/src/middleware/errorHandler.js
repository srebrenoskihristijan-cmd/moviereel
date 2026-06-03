// 404 for unmatched routes.
export const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Central error handler: turns thrown/forwarded errors into clean responses.
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Mongoose schema validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed.",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  // duplicate key (unique index)
  if (err.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value.",
      fields: Object.keys(err.keyValue || {}),
    });
  }
  // bad ObjectId etc.
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error." });
};
