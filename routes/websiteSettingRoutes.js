const express = require("express");

const router = express.Router();

const {
    getWebsiteSettings,
    updateWebsiteSettings,
    uploadHeroVideo,
} = require("../controllers/websiteSettingController");

const { protect } = require("../middleware/authMiddleware");

const uploadVideo = require("../middleware/videoUploadMiddleware");

// ======================================
// Public
// ======================================

router.get("/", getWebsiteSettings);

// ======================================
// Admin
// ======================================

router.put(
    "/",
    protect,
    updateWebsiteSettings
);

// Upload Hero Video
router.put(
    "/hero-video",
    protect,
    uploadVideo.single("heroVideo"),
    uploadHeroVideo
);

module.exports = router;