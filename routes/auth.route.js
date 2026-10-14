import passport from "passport";
import { Router } from "express";
const authRouter = Router();
import authController from "../controllers/auth.controller.js";
import redirectIfAuthenticated from "../middlewares/redirectIfAuthenticated.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import validateUser from "../validators/validateUser.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

//logged in user pipeline
authRouter.post("/logout", ensureAuthenticated, authController.userLogoutPost);

//un-logged in user pipeline
authRouter.use(redirectIfAuthenticated);

authRouter.get("/signup", authController.userCreateGet);
authRouter.post(
  "/signup",
  validateUser,
  handleValidationErrors,
  authController.userCreatePost,
);
authRouter.get("/login", authController.userLoginGet);
authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureMessage: true,
  }),
);

export default authRouter;
