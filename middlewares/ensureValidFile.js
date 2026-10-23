//multer
import multer from "multer";
import path from "path";

//allowed file types
const allowedExtensions = [
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
  ".pdf",
  ".doc",
  ".docx",
];
const allowedMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multer.memoryStorage(), //store in memory instead of disk storage
  limits: { fileSize: 1024 * 1024 * 5 }, //each file 5mb max
  fileFilter: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const isExtValid = allowedExtensions.includes(fileExt);
    const isMimeValid = allowedMime.includes(file.mimetype);

    if (isExtValid && isMimeValid) {
      return cb(null, true);
    } else {
      const error = new Error(
        "Unsupported file format! Only Images (.jpeg, .png, .webp) and Documents (.pdf, .doc, .docx) are allowed.",
      );
      error.status = 400;
      return cb(error, false);
    }
  },
});

function ensureValidFile(req, res, next) {
  upload.single("file")(req, res, (error) => {
    if (error) {
      req.validationErrors = [{ msg: error.message }];
      return next();
    }
    return next();
  });
}

export default ensureValidFile;
