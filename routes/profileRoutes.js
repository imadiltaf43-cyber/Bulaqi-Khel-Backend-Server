const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile,
    changePassword,
    sendEmailOtp,
    verifyEmailOtp,
    changeEmail,
} = require("../controllers/profileController");


const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

router.get("/", protect, getProfile);

router.put(
  "/",
  protect,
  upload.single("profileImage"),
  updateProfile
);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.put(
    "/send-email-otp",
    protect,
    sendEmailOtp
);

router.put(
    "/verify-email-otp",
    protect,
    verifyEmailOtp
);

router.put(
    "/change-email",
    protect,
    changeEmail
);


module.exports = router;