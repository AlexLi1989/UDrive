import { body } from "express-validator";
import { findUserEmail } from "../db/user.js";

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Username must be between 1 and 50 characters.")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email.")
    .isLength({ max: 254 })
    .withMessage("Email must be less than 254 characters.")
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
    .withMessage("Password must be between 8 and 72 characters.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/\d/)
    .withMessage("Password must contain at least one digit.")
    .matches(/[!@#$%^&*(),.?":{}|<>_+=-]/)
    .withMessage("Password must contain at least one special character."),
  body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password does not match.");
      }
      return true;
    }),
];

export default validateUser;
