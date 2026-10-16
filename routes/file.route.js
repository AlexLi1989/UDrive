import { Router } from "express";
const fileRouter = Router();
import fileController from "../controllers/file.controller.js";
import validateFileUpdate from "../validators/validateFileUpdate.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

//multer
import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(), //store in memory instead of disk storage
  limits: { fileSize: 1024 * 1024 * 5 }, //each file 5mb max
});

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
fileRouter.post(
  "/upload",
  upload.single("file"),
  fileController.fileCreatePost,
);
fileRouter.get("/:id/download", fileController.fileDownloadGet);
fileRouter.get("/:id/update", fileController.fileUpdateGet);
fileRouter.post(
  "/:id/update",
  validateFileUpdate,
  handleValidationErrors,
  fileController.fileUpdatePost,
);
fileRouter.post("/:id/delete", fileController.fileDeletePost);

export default fileRouter;
