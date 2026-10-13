const userContext = (req, res, next) => {
  res.locals.currentUser = req.user;
  if (req.session) {
    res.locals.loginErrors = req.session.messages || [];
    req.session.messages = [];
  } else {
    res.locals.loginErrors = [];
  }
  next();
};

export default userContext;
