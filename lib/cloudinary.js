//cloudinary module and config
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function deleteCloudinaryFile(url) {
  if (!url) {
    return;
  }
  try {
    if (url.includes("/udrive/")) {
      const fileStr = url.split("/udrive/")[1];
      const public_id = "udrive/" + fileStr.split(".")[0];
      await cloudinary.uploader.destroy(public_id);
    }
  } catch (error) {
    console.error("Error deleting cloudinary image:", error);
  }
}
export { cloudinary, deleteCloudinaryFile };
