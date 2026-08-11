const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "United-Bulaqi-Khel/Minerals",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    resource_type: "auto",
  },
});

const upload = multer({
  storage,
});



module.exports = upload;