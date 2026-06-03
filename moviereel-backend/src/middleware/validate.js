import { validationResult } from "express-validator";

// Application-level validation: runs the express-validator chain results and
// rejects bad input BEFORE it reaches the controller / database.
export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
};
