import { matchedData } from "express-validator";
import {
  verifyFolderOwner,
  getFolderBreadcrumbs,
  getFolderContents,
  getRootContents,
  findAllFolders,
} from "../db/directory.js";
import {
  verifyFileOwner,
  insertFile,
  updateFile,
  deleteFile,
  calcTotalUsage,
} from "../db/file.js";
import {
  uploadCloudinaryFile,
  deleteCloudinaryFile,
} from "../lib/cloudinary.js";
import { Readable } from "node:stream";

async function fileGet(req, res, next) {
  const userId = req.user.id;
  const fileId = req.params.id;
  try {
    const file = await verifyFileOwner(userId, fileId);
    return res.json({
      id: file.id,
      name: file.name,
      size: (file.size / 1024 ** 2).toFixed(2) + " MB",
      folderId: file.folderId,
      createdAt: file.createdAt,
    });
  } catch (error) {
    return next(error);
  }
}

async function fileCreatePost(req, res, next) {
  const userId = req.user.id;
  const fileName = req.body.name;
  const folderId = req.body.folderId;
  try {
    if (folderId) {
      await verifyFolderOwner(userId, folderId);
    }
    const currentUsage = await calcTotalUsage(userId);
    const newUsage = currentUsage + req.file.size / (1024 * 1024);
    if (newUsage > 50) {
      if (folderId) {
        const [breadcrumbs, { folders, files }] = await Promise.all([
          //breadcrumbs
          getFolderBreadcrumbs(folderId, userId),
          //fetch folders and files under parent folder
          getFolderContents(folderId),
        ]);
        const currentFolderName =
          breadcrumbs[breadcrumbs.length - 1]?.name || "Folder";
        return res.status(400).render("folder", {
          TITLE: `UDrive - ${currentFolderName}`,
          BREADCRUMBS: breadcrumbs,
          FOLDERS: folders,
          FILES: files,
          TOTAL_USAGE: currentUsage,
          ERRORS: [{ msg: "Exceeded storage limit." }],
          OPEN_FAILED_UPLOAD_MODAL: true, //render modal automatically
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
          TOTAL_USAGE: currentUsage,
          ERRORS: [{ msg: "Exceeded storage limit." }],
          OPEN_FAILED_UPLOAD_MODAL: true,
        });
      }
    }
    if (req.file) {
      const uploadResult = await uploadCloudinaryFile(req.file);
      const fileUrl = uploadResult.secure_url;
      const mimeType = req.file.mimetype;

      await insertFile(
        fileName,
        fileUrl,
        req.file.size,
        mimeType,
        userId,
        folderId || null,
      );

      return folderId
        ? res.redirect(`/folders/${folderId}`)
        : res.redirect("/");
    }
  } catch (error) {
    return next(error);
  }
}

async function fileDownloadGet(req, res, next) {
  const userId = req.user.id;
  const fileId = req.params.id;
  try {
    const file = await verifyFileOwner(userId, fileId);
    const fileUrl = file.url;
    const response = await fetch(fileUrl);
    if (!response.ok) {
      const error = new Error("Failed to download file");
      error.status = response.status;
      throw error;
    }
    res.attachment(file.name);
    res.setHeader("Content-Type", response.headers.get("content-type"));
    const nodeStream = Readable.fromWeb(response.body);
    nodeStream.pipe(res);
  } catch (error) {
    return next(error);
  }
}

async function fileUpdateGet(req, res, next) {
  const userId = req.user.id;
  const fileId = req.params.id;
  try {
    const file = await verifyFileOwner(userId, fileId);
    const allFolders = await findAllFolders(userId);
    return res.json({
      file: {
        id: file.id,
        name: file.name,
        folderId: file.folderId,
        createdAt: file.createdAt,
      },
      allFolders: allFolders,
    });
  } catch (error) {
    return next(error);
  }
}

async function fileUpdatePost(req, res, next) {
  const userId = req.user.id;
  const fileId = req.params.id;
  const { name, folderId } = matchedData(req);
  try {
    const file = await verifyFileOwner(userId, fileId);
    if (folderId) {
      await verifyFolderOwner(userId, folderId);
    }
    await updateFile(fileId, name, folderId || null);
    return folderId ? res.redirect(`/folders/${folderId}`) : res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

async function fileDeletePost(req, res, next) {
  const userId = req.user.id;
  const fileId = req.params.id;
  try {
    const file = await verifyFileOwner(userId, fileId);
    const folderId = file.folderId;
    await deleteCloudinaryFile(file.url);
    await deleteFile(userId, fileId);
    return folderId ? res.redirect(`/folders/${folderId}`) : res.redirect("/");
  } catch (error) {
    return next(error);
  }
}

export {
  fileGet,
  fileCreatePost,
  fileDownloadGet,
  fileUpdateGet,
  fileUpdatePost,
  fileDeletePost,
};
