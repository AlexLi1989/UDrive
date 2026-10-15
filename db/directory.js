import prisma from "../lib/prisma.js";

async function getRootContents(userId) {
  const [rootFolders, rootFiles] = await Promise.all([
    prisma.folder.findMany({ where: { userId, parentId: null } }),
    prisma.file.findMany({ where: { userId, folderId: null } }),
  ]);

  return { rootFolders, rootFiles };
}

async function verifyFolderOwner(userId, folderId) {
  try {
    //not findUnique as it only allows @id
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) {
      const error = new Error("Access Denied");
      error.status = 404; //mask with 404
      throw error;
    }
  } catch (error) {
    console.error("Failed to verify folder owner: ", error);
    throw error;
  }
}

async function getFolderBreadcrumbs(folderId, userId) {
  if (!folderId) return [];
  try {
    const allFolders = await prisma.folder.findMany({
      where: { userId: userId },
      select: { id: true, name: true, parentId: true },
    });
    const folderMap = new Map();
    allFolders.forEach((folder) => {
      folderMap.set(folder.id, folder);
    });
    const breadcrumbs = [];
    let currentId = folderId;
    while (currentId) {
      const currentFolder = folderMap.get(currentId);
      if (!currentFolder) break;
      breadcrumbs.push({
        id: currentFolder.id,
        name: currentFolder.name,
      });
      currentId = currentFolder.parentId;
    }
    return breadcrumbs.reverse();
  } catch (error) {
    console.error("Failed to get breadcrumbs:", error);
    throw error;
  }
}
//alternate way to get breadcrumbs using Prisma's raw query
/*const breadcrumbs = await prisma.$queryRaw`
      WITH RECURSIVE folder_tree AS (
        SELECT id, name, "parentId", 1 as depth
        FROM "Folder"
        WHERE id = ${folderId}
        UNION ALL
        SELECT f.id, f.name, f."parentId", ft.depth + 1
        FROM "Folder" f
        INNER JOIN folder_tree ft ON f.id = ft."parentId"
      )
      SELECT id, name FROM folder_tree ORDER BY depth DESC;
    `;
    return breadcrumbs; */

async function getFolderContents(folderId) {
  const [folders, files] = await Promise.all([
    prisma.folder.findMany({ where: { parentId: folderId } }),
    prisma.file.findMany({ where: { folderId } }),
  ]);

  return { folders, files };
}

async function createFolder(name, parentId, userId) {
  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        parentId,
        userId,
      },
    });
    return folder;
  } catch (error) {
    console.error("Failed to create folder: ", error);
    throw error;
  }
}

async function updateFolder(folderId, name) {
  try {
    const folder = await prisma.folder.update({
      where: { id: folderId },
      data: {
        name,
      },
    });
    return folder;
  } catch (error) {
    console.error("Failed to update folder: ", error);
    throw error;
  }
}

async function findParentFolder(folderId) {
  try {
    const parentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
      select: { parentId: true },
    });
    if (!parentFolder) {
      return null;
    }
    const parentId = parentFolder?.parentId;
    return parentId;
  } catch (error) {
    console.error("Failed to find parent folder: ", error);
    throw error;
  }
}

async function findAllDescendantFiles(folderId) {
  if (!folderId) return;
  //
  const folders = await prisma.$queryRaw`
  WITH RECURSIVE folder_tree AS (
    SELECT id, parentId FROM "Folder" WHERE id = ${folderId}
    UNION ALL
    SELECT f.id, f.parentId FROM "Folder" f
    JOIN folder_tree ft ON f.parentId = ft.id
  )
  SELECT id FROM folder_tree;
`;
  const allFolderIds = folders.map((folder) => folder.id);
  const files = await prisma.file.findMany({
    where: {
      folderId: {
        in: allFolderIds,
      },
    },
    select: {
      url: true,
    },
  });
  const filesUrls = files.map((url) => url.url);
  return filesUrls;
}

async function deleteFolder(folderId) {
  try {
    const deleteFolder = await prisma.folder.delete({
      where: { id: folderId },
    });
  } catch (error) {
    console.error("Failed to delete chosen folder: ", error);
    throw error;
  }
}

export {
  getRootContents,
  verifyFolderOwner,
  getFolderBreadcrumbs,
  getFolderContents,
  createFolder,
  updateFolder,
  findParentFolder,
  findAllDescendantFiles,
  deleteFolder,
};
