import { Router } from "express";
const folderRouter = Router();
import folderController from "../controllers/folder.controller.js";
import validateFolderCreate from "../validators/validateFolderCreate.js";
import validateFolderUpdate from "../validators/validateFolderUpdate.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";

//regex to check for id that fits UUID
folderRouter.param("id", (req, res, next, id) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    const error = new Error("Invalid Folder ID Format");
    error.status = 404;
    return next(error);
  }
  next();
});

folderRouter.get("/:id", folderController.folderGet);
folderRouter.post(
  "/",
  validateFolderCreate,
  handleValidationErrors,
  folderController.folderCreatePost,
);
folderRouter.post(
  "/:id/update",
  validateFolderUpdate,
  handleValidationErrors,
  folderController.folderUpdatePost,
);
folderRouter.post("/:id/delete", folderController.folderDeletePost);

export default folderRouter;
