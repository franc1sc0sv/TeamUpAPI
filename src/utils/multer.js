import multer from "multer";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== '.webp') {
      cb(new Error("UnsupportedFile"), false);
      return;
    }
    cb(null, true);
  },
});

export default upload;
