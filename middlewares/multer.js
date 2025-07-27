import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const suffix = Date.now();
    cb(null, suffix + '-' + file.originalname);
  },
});

export const upload = multer({ storage });