import { body } from "express-validator";

const validateFileUpdate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("File name cannot be empty.")
    .isLength({ max: 50 })
    .withMessage("File name must be less than 50 characters.")
    .escape(),
  body("folderId")
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage("Invalid destination folder structure."),
];

export default validateFileUpdate;
