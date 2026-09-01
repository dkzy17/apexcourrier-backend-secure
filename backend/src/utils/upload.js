const multer = require("multer");

const storage = multer.memoryStorage();

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const MAX_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_SIZE,
    files: 1,
    fields: 30,
    parts: 32,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG, and WebP images are allowed")
      );
    }

    const filename = String(file.originalname || "");

    if (
      filename.includes("\0") ||
      filename.length > 255 ||
      !/\.(jpe?g|png|webp)$/i.test(filename)
    ) {
      return cb(new Error("Invalid image filename"));
    }

    cb(null, true);
  },
});

module.exports = upload;
