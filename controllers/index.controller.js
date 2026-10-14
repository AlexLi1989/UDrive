import { getRootFolders, getRootFiles } from "../db/directory.js";
import { calcTotalUsage } from "../db/file.js";

async function indexGet(req, res, next) {
  //route for visitor
  if (!req.isAuthenticated()) {
    return res.render("landing", {
      TITLE: "Welcome to UDrive",
    });
  }
  //route for authenticated user
  const userId = req.user.id;
  try {
    const [rootFolders, rootFiles, totalUsage] = await Promise.all([
      //fetch root folders
      getRootFolders(userId),
      //fetch root files
      getRootFiles(userId),
      //calculate total usage
      calcTotalUsage(userId),
    ]);
    return res.render("dashboard", {
      TITLE: "Welcome to UDrive",
      FOLDERS: rootFolders,
      FILES: rootFiles,
      TOTAL_USAGE: totalUsage,
    });
  } catch (error) {
    next(error);
  }
}

export { indexGet };
