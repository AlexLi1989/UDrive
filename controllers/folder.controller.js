import { matchedData } from "express-validator";
import {
  verifyFolderOwner,
  getFolderBreadcrumbs,
  getFolderContents,
  getRootContents,
  createFolder,
  updateFolder,
  findParentFolder,
  findAllDescendantFiles,
  deleteFolder,
} from "../db/directory.js";
import { calcTotalUsage } from "../db/file.js";
import { deleteCloudinaryFile } from "../lib/cloudinary.js";

//get non root level folders
async function folderGet(req, res, next) {
  const userId = req.user.id;
  const folderId = req.params.id;
  try {
    await verifyFolderOwner(userId, folderId);
  } catch (error) {
    return next(error);
  }
  try {
    const [breadcrumbs, { folders, files }, totalUsage] = await Promise.all([
      //breadcrumbs
      getFolderBreadcrumbs(folderId, userId),
      //fetch folders and files under parent folder
      getFolderContents(folderId),
      //calculate total usage
      calcTotalUsage(userId),
    ]);
    const currentFolderName =
      breadcrumbs[breadcrumbs.length - 1]?.name || "Folder";
    return res.render("folder", {
      TITLE: `UDrive - ${currentFolderName}`,
      BREADCRUMBS: breadcrumbs,
      FOLDERS: folders,
      FILES: files,
      TOTAL_USAGE: totalUsage,
    });
  } catch (error) {
    next(error);
  }
}

//create new folder post
async function folderCreatePost(req, res, next) {
  const userId = req.user.id;
  const { name, parentId } = matchedData(req);
  try {
    if (parentId) {
      await verifyFolderOwner(userId, parentId);
    }
    if (req.validationErrors) {
      const totalUsage = await calcTotalUsage(userId);
      //creation at non root level
      if (parentId) {
        const [breadcrumbs, { folders, files }] = await Promise.all([
          //breadcrumbs
          getFolderBreadcrumbs(parentId, userId),
          //fetch folders and files under parent folder
          getFolderContents(parentId),
        ]);
        const currentFolderName =
          breadcrumbs[breadcrumbs.length - 1]?.name || "Folder";
        return res.status(400).render("folder", {
          TITLE: `UDrive - ${currentFolderName}`,
          BREADCRUMBS: breadcrumbs,
          FOLDERS: folders,
          FILES: files,
          TOTAL_USAGE: totalUsage,
          ERRORS: req.validationErrors,
          LASTPARAMS: req.body,
          OPEN_CREATE_MODAL: true, //render modal automatically
        });
        //creation at root level
      } else {
        const [rootContent] = await Promise.all([
          //fetch root folders and files
          getRootContents(userId),
        ]);
        const { rootFolders, rootFiles } = rootContent;
        return res.status(400).render("dashboard", {
          TITLE: "Welcome to UDrive",
          FOLDERS: rootFolders,
          FILES: rootFiles,
          TOTAL_USAGE: totalUsage,
          ERRORS: req.validationErrors,
          LASTPARAMS: req.body,
          OPEN_CREATE_MODAL: true,
        });
      }
    }
    await createFolder(name, parentId, userId);
    return parentId ? res.redirect(`/folders/${parentId}`) : res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

//update folder name post
async function folderUpdatePost(req, res, next) {
  const userId = req.user.id;
  const folderId = req.params.id;
  const { name } = matchedData(req);
  try {
    await verifyFolderOwner(userId, folderId);
    const parentId = await findParentFolder(userId, folderId);
    if (req.validationErrors) {
      const totalUsage = await calcTotalUsage(userId);
      //update at non root level
      if (parentId) {
        const [breadcrumbs, { folders, files }] = await Promise.all([
          //breadcrumbs
          getFolderBreadcrumbs(parentId),
          //fetch folders and files under parent folder
          getFolderContents(parentId),
        ]);
        const currentFolderName =
          breadcrumbs[breadcrumbs.length - 1]?.name || "Folder";
        return res.status(400).render("folder", {
          TITLE: `UDrive - ${currentFolderName}`,
          BREADCRUMBS: breadcrumbs,
          FOLDERS: folders,
          FILES: files,
          TOTAL_USAGE: totalUsage,
          ERRORS: req.validationErrors,
          LASTPARAMS: req.body,
          OPEN_UPDATE_MODAL: true,
        });
        //update at root level
      } else {
        const [rootContent] = await Promise.all([
          //fetch root folders and files
          getRootContents(userId),
        ]);
        const { rootFolders, rootFiles } = rootContent;
        return res.status(400).render("dashboard", {
          TITLE: "Welcome to UDrive",
          FOLDERS: rootFolders,
          FILES: rootFiles,
          TOTAL_USAGE: totalUsage,
          ERRORS: req.validationErrors,
          LASTPARAMS: req.body,
          OPEN_UPDATE_MODAL: true,
        });
      }
    }
    await updateFolder(folderId, name);
    return parentId ? res.redirect(`/folders/${parentId}`) : res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

//delete folder post
async function folderDeletePost(req, res, next) {
  const userId = req.user.id;
  const folderId = req.params.id;
  try {
    await verifyFolderOwner(userId, folderId);
    const parentId = await findParentFolder(folderId);
    const fileUrls = await findAllDescendantFiles(folderId);
    await Promise.all(
      fileUrls.map((fileUrl) => {
        return deleteCloudinaryFile(fileUrl);
      }),
    );
    await deleteFolder(folderId);
    return parentId ? res.redirect(`/folders/${parentId}`) : res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

export { folderGet, folderCreatePost, folderUpdatePost, folderDeletePost };
