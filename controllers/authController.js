const bcrypt = require("bcryptjs");
const Otp = require("../models/Otp");
const sendEmail = require("../utils/sendEmail");

const User = require("../models/User");
const jwt = require("jsonwebtoken");



const generateToken = (id, role) => {
  return jwt.sign(
    {
      id,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

// =====================================
// Register
// =====================================

exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      role,
    });

    res.status(201).json({
      success: true,
      message: "Admin Created Successfully",
      user,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// Login
// =====================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Account Disabled",
      });
    }

    if (
      user.lockUntil &&
      user.lockUntil > Date.now()
    ) {
      return res.status(423).json({
        message:
          "Account Locked. Try again later.",
      });
    }

    const isMatch =
      await user.matchPassword(password);

    if (!isMatch) {
      user.failedAttempts += 1;

      if (user.failedAttempts >= 5) {
        user.lockUntil =
          Date.now() + 15 * 60 * 1000;
      }

      await user.save();

      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    user.lastLogin = new Date();

    const token = generateToken(
      user._id,
      user.role
    );

    user.refreshToken = token;

    await user.save();

    res.json({
      success: true,

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage:
          user.profileImage,
        lastLogin:
          user.lastLogin,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================
// Forgot Password
// =====================================

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "No account found with this email.",
      });
    }

    // Delete old OTP if it exists
    await Otp.deleteMany({ email });

    // Generate 6-digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Save OTP
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Send Email
    await sendEmail(
      email,
      "UBKE Password Reset OTP",
      `
      <div style="font-family:Arial;padding:20px">
          <h2>UBKE Admin Portal</h2>

          <p>Your OTP for password reset is:</p>

          <h1 style="letter-spacing:5px;color:#D4AF37">
              ${otp}
          </h1>

          <p>
              This OTP will expire in
              <strong>10 minutes</strong>.
          </p>

          <p>
              If you didn't request this,
              simply ignore this email.
          </p>
      </div>
      `
    );

    res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// =====================================
// Verify OTP
// =====================================

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteMany({ email });

      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    res.json({
      success: true,
      message: "OTP Verified Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};

// =====================================
// Reset Password
// =====================================

exports.resetPassword = async (req, res) => {
  try {

    const {
      email,
      otp,
      newPassword,
    } = req.body;

    const otpRecord = await Otp.findOne({
      email,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP Expired",
      });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.password = newPassword;

    await user.save();

    await Otp.deleteMany({
      email,
    });

    res.json({
      success: true,
      message: "Password Updated Successfully",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message,
    });
  }
};