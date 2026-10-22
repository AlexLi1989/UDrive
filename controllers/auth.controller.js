import { matchedData } from "express-validator";
import { createUser } from "../db/user.js";

//signup get
function userCreateGet(req, res, next) {
  res.render("signup", {
    TITLE: "UDrive - Sign Up",
  });
}

//signup post
async function userCreatePost(req, res, next) {
  try {
    if (req.validationErrors) {
      return res.status(400).render("signup", {
        TITLE: "UDrive - Sign Up",
        ERRORS: req.validationErrors,
        LASTPARAMS: req.lastParams,
      });
    }
    const { email, password, username } = matchedData(req);
    const dbUser = await createUser({ email, password, username });
    //encapsulate login and session.save in promises to allow render redirects user after auto login
    await new Promise((resolve, reject) => {
      req.login(dbUser, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
    return res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

//login get
function userLoginGet(req, res, next) {
  res.render("login", {
    TITLE: "UDrive - Log In",
  });
}

//logout post
function userLogoutPost(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    return res.redirect("/");
  });
}

export default { userCreateGet, userCreatePost, userLoginGet, userLogoutPost };
