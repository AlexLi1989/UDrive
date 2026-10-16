import prisma from "../lib/prisma.js";

async function calcTotalUsage(userId) {
  try {
    const sumFileSize = await prisma.file.aggregate({
      where: { userId },
      _sum: { size: true },
    });
    const totalBytes = sumFileSize._sum.size || 0;
    const totalUsage = totalBytes / (1024 * 1024); // Convert bytes to MB
    return totalUsage;
  } catch (error) {
    throw error;
  }
}

async function verifyFileOwner(userId, fileId) {
  try {
    //not findUnique as it only allows @id
    const file = await prisma.file.findFirst({
      where: { id: fileId, userId },
    });
    if (!file) {
      const error = new Error("Access Denied");
      error.status = 404; //mask with 404
      throw error;
    }
    return file;
  } catch (error) {
    console.error("Failed to verify file owner: ", error);
    throw error;
  }
}

async function insertFile(name, url, size, mimeType, userId, folderId) {
  try {
    const file = await prisma.file.create({
      data: {
        name,
        url,
        size,
        mimeType,
        userId,
        folderId,
      },
    });
    return file;
  } catch (error) {
    console.error("Failed to insert file: ", error);
    throw error;
  }
}

async function updateFile(fileId, name, folderId) {
  try {
    const updatedFile = await prisma.file.update({
      where: { id: fileId },
      data: {
        name,
        folderId,
      },
    });
    return updatedFile;
  } catch (error) {
    console.error("Failed to update file: ", error);
    throw error;
  }
}

async function deleteFile(fileId) {
  try {
    const deleteFile = await prisma.file.delete({
      where: { id: fileId },
    });
  } catch (error) {
    console.error("Failed to delete file: ", error);
    throw error;
  }
}

export { verifyFileOwner, insertFile, updateFile, deleteFile, calcTotalUsage };
