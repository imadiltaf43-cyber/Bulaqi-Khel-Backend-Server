const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => ({
    folder: "United-Bulaqi-Khel/Careers",

    resource_type: "auto",

    public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`,
  }),
});

const fileFilter = (req, file, cb) => {

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP, PDF, DOC and DOCX files are allowed."
      ),
      false
    );
  }

};

const upload = multer({
  storage,

  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },

  fileFilter,
});

module.exports = {
  uploadJobImage: upload.single("jobImage"),
  uploadCV: upload.single("cv"),
};