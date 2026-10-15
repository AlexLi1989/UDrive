import { body } from "express-validator";

const validateFolderUpdate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("New folder name cannot be empty.")
    .isLength({ max: 50 })
    .withMessage("New folder name must be less than 50 characters.")
    .escape(),
];

export default validateFolderUpdate;
