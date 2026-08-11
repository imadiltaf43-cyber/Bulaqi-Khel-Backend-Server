const User = require("../models/User");
const cloudinary = require("../config/cloudinary");


const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

// ===============================
// Get Current Profile
// ===============================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// ===============================
// Update Profile
// ===============================

exports.updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.fullName =
      req.body.fullName || user.fullName;

    user.phone =
      req.body.phone || user.phone;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile Updated",
      user,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};


const bcrypt = require("bcryptjs");

// ===============================
// Change Password
// ===============================

exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current password

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
      });
    }

    // Confirm password

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    // Prevent same password

    const samePassword = await user.matchPassword(newPassword);

    if (samePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as current password.",
      });
    }

    

    user.password = newPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully.",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};



// =======================================
// Send OTP For Email Change
// =======================================

exports.sendEmailOtp = async (req, res) => {
    try {

        const { newEmail } = req.body;

        if (!newEmail) {
            return res.status(400).json({
                message: "New email is required",
            });
        }

        // Check if email already exists
        const exists = await User.findOne({
            email: newEmail,
        });

        if (exists) {
            return res.status(400).json({
                message: "Email already exists",
            });
        }

        // Delete previous OTPs
        await Otp.deleteMany({
            email: newEmail,
        });

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        await Otp.create({
            email: newEmail,
            otp,
            expiresAt: new Date(
                Date.now() + 10 * 60 * 1000
            ),
        });

        await sendEmail(
            newEmail,
            "UBKE Email Verification",
            `
            <div style="font-family:Arial;padding:20px">
                <h2>United Bulaqi Khel Enterprises</h2>

                <p>Your verification OTP is</p>

                <h1 style="color:#D4AF37">
                    ${otp}
                </h1>

                <p>
                    This OTP expires in 10 minutes.
                </p>
            </div>
            `
        );

        res.json({
            success: true,
            message: "OTP sent successfully.",
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }
};

// =======================================
// Verify Email OTP
// =======================================

exports.verifyEmailOtp = async (req, res) => {

    try {

        const { newEmail, otp } = req.body;

        const record = await Otp.findOne({
            email: newEmail,
            otp,
        });

        if (!record) {

            return res.status(400).json({
                message: "Invalid OTP",
            });

        }

        if (record.expiresAt < new Date()) {

            return res.status(400).json({
                message: "OTP Expired",
            });

        }

        res.json({
            success: true,
            message: "OTP Verified",
        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};


// =======================================
// Change Email
// =======================================

exports.changeEmail = async (req, res) => {

    try {

        const { newEmail } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {

            return res.status(404).json({
                message: "User not found",
            });

        }

        user.email = newEmail;

        await user.save();

        await Otp.deleteMany({
            email: newEmail,
        });

        res.json({

            success: true,

            message: "Email updated successfully",

        });

    } catch (err) {

        res.status(500).json({
            message: err.message,
        });

    }

};