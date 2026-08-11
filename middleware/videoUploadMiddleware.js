const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/videos");

    },

    filename(req, file, cb) {

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    },

});

const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "video/mp4",

        "video/webm",

        "video/quicktime",

    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    }

    else {

        cb(new Error("Only video files are allowed."), false);

    }

};

module.exports = multer({

    storage,

    fileFilter,

});