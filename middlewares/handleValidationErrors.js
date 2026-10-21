import { validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.validationErrors = errors.array();
      req.LASTPARAMS = req.body;
      return next();
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
export default handleValidationErrors;
