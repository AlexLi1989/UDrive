app.use((req, res, next) => {
  const error = new Error("The requested page was not found.");
  error.status = 404;
  next(error);
});

export default notFoundHandler;
