import { getRootContents } from "../db/directory.js";
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
    const [rootContent, totalUsage] = await Promise.all([
      //fetch root folders and files
      getRootContents(userId),
      //calculate total usage
      calcTotalUsage(userId),
    ]);
    const { rootFolders, rootFiles } = rootContent;
    return res.render("dashboard", {
      TITLE: "Welcome to UDrive",
      FOLDERS: rootFolders,
      FILES: rootFiles,
      TOTAL_USAGE: totalUsage,
    });
  } catch (error) {
    return next(error);
  }
}

export { indexGet };
