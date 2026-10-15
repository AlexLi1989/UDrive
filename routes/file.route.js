import { Router } from "express";
const fileRouter = Router();
import fileController from "../controllers/file.controller.js";

//regex to check for id that fits UUID
fileRouter.param("id", (req, res, next, id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    const error = new Error("Invalid File ID Format");
    error.status = 404;
    return next(error);
  }
  next();
});

fileRouter.get("/:id", fileController.fileGet);

export default fileRouter;
