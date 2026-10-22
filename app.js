import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import prismaSessionConfig from "./config/prismaSession.js";
import passport from "passport";
import "./config/passport.js";
//routers
import authRouter from "./routes/auth.route.js";
import indexRouter from "./routes/index.route.js";
import folderRouter from "./routes/folder.route.js";
import fileRouter from "./routes/file.route.js";

//middleware
import ensureAuthenticated from "./middlewares/ensureAuthenticated.js";
import userContext from "./middlewares/userContext.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

//session config
app.set("trust proxy", 1);
app.use(prismaSessionConfig);

//passport config
app.use(passport.session());

//setting global current user
app.use(userContext);

//routes
app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use(ensureAuthenticated);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

//404 route
app.use(notFoundHandler);

//error route
app.use(errorHandler);

export default app;
