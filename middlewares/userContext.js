const userContext = (req, res, next) => {
  res.locals.currentUser = req.user ?? null;
  next();
};

export default userContext;
