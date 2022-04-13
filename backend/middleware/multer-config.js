const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, res, callabck) => {
    callabck(null, "images");
  },
  filename: (req, file, callback) => {
    const userFileName = file.originalname.split(" ").join("_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, userFileName + "." + uniqueSuffix);
  },
});

const fileFilter = (req, res, callback) => {
  if (
    file.mimetype.includes("jpeg") ||
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg")
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

module.exports = multer({ storage: storage, fileFilter: fileFilter }).single(
  "image"
);
