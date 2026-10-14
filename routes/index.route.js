import { Router } from "express";
const indexRouter = Router();
import indexController from "../controllers/index.controller.js";

indexRouter.get("/", indexController.indexGet);

export default indexRouter;
