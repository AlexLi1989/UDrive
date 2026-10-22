function errorHandler(err, req, res, next) {
  console.error(err);
  let statusCode;
  let details = {};
  //401
  if (err.status == 401) {
    statusCode = 401;
    details = {
      TITLE: "401 Unauthorized",
      HEADER: "401 Unauthorized",
      MESSAGE: "You are not authorized to access this page.",
    };
  }

  //403
  else if (err.status == 403) {
    statusCode = 403;
    details = {
      TITLE: "403 Forbidden",
      HEADER: "403 Forbidden",
      MESSAGE: "You are not authorized to access this page.",
    };
  }
  //404
  else if (err.status == 404) {
    statusCode = 404;
    details = {
      TITLE: "404 Not Found",
      HEADER: "404 Not Found",
      MESSAGE: "The requested page was not found.",
    };
  }
  //500
  else {
    statusCode = 500;
    details = {
      TITLE: "500 Internal Server Error",
      HEADER: "500 Internal Server Error",
      MESSAGE: "Something went wrong on our server. Please try again later.",
    };
  }
  res.status(statusCode);

  if (req.xhr || req.headers.accept?.includes("json")) {
    return res.json({ error: details.MESSAGE });
  }

  return res.render("error", details);
}

export default errorHandler;
