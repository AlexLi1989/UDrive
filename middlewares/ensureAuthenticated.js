//check for logged in status
function ensureAuthenticated(req, res, next) {
  if (!req.isAuthenticated?.()) {
    const error = new Error("Unauthorized");
    error.status = 401;
    return next(error);
  }
  if (!req.user) {
    //edge case for user deleted while session is still active
    return req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  }
  return next();
}

export default ensureAuthenticated;
