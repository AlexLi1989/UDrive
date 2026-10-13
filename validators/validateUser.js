import { body } from "express-validator";
import { findUserEmail } from "../db/user.js";

const nameLengthErr = "Must be between 1 and 50 characters.";
const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(nameLengthErr)
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email.")
    .isLength({ max: 254 })
    .withMessage("Must be less than 254 characters.")
    .custom(async (value) => {
      const isNotUnique = await findUserEmail({ email: value });
      if (isNotUnique) {
        throw new Error("Email already exists.");
      }
      return true;
    })
    .escape()
    .normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 8, max: 72 })
    .withMessage("Must be between 8 and 72 characters.")
    .matches(/[A-Z]/)
    .withMessage("Must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Must contain at least one digit.")
    .matches(/[!@#$%^&*(),.?":{}|<>_+-=]/)
    .withMessage("Must contain at least one special character."),
  body("confirm_password")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match.");
      }
      return true;
    }),
];

export default validateUser;
