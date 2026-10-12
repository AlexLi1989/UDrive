import { express } from "express";
import { path } from "node:path";
import prismaSessionConfig from "./config/prismaSession";
import { passport } from "passport";
import("./config/passport");
//routers
import indexRouter from "./routes/indexRouter";
import authRouter from "./routes/authRouter";
//middleware
import notFoundHandler from "./middlewares/notFoundHandler";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

//session config
app.set("trust proxy", 1);
app.use(prismaSessionConfig);

//passport config
app.use(passport.session());

//setting global current user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  if (req.session) {
    res.locals.loginErrors = req.session.messages || [];
    req.session.messages = [];
  } else {
    res.locals.loginErrors = [];
  }
  next();
});

//routes
app.use("/", indexRouter);
app.use("/auth", authRouter);

//404 route
app.use(notFoundHandler);

//error route
app.use(errorHandler);

export { app };
