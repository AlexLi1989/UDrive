import { validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.validationErrors = errors.array();
      req.lastParams = req.body;
      return next();
    }
  } catch (error) {
    next(error);
  }
  return next();
};
export default handleValidationErrors;
