import { body } from "express-validator";

const validateFolderCreate = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name cannot be empty.")
    .isLength({ max: 50 })
    .withMessage("Folder name must be less than 50 characters.")
    .escape(),
  body("parentId")
    .optional({ checkFalsy: true })
    .isUUID()
    .withMessage("Invalid parent folder structure."),
];

export default validateFolderCreate;
