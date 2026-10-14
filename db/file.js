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

export { calcTotalUsage };
