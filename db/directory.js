import prisma from "../lib/prisma.js";

async function getRootFolders(userId) {
  try {
    const rootFolders = await prisma.folder.findMany({
      where: { userId, parentId: null },
    });
    return rootFolders;
  } catch (error) {
    throw error;
  }
}

async function getRootFiles(userId) {
  try {
    const rootFiles = await prisma.file.findMany({
      where: { userId, folderId: null },
    });
    return rootFiles;
  } catch (error) {
    throw error;
  }
}

export { getRootFolders, getRootFiles };
