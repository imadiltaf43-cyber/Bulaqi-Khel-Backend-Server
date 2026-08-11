const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ======================================
// Protect Routes
// ======================================

exports.protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.trim()) {
        return res.status(401).json({
            message: "No Token",
        });
    }

    const [scheme, token] = authHeader.trim().split(" ");

    if (!scheme || !token || scheme.toLowerCase() !== "bearer") {
        return res.status(401).json({
            message: "No Token",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
};

// ======================================
// Role Middleware
// ======================================

exports.authorize = (...roles) => {

    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                message: "Access Denied"
            });

        }

        next();

    };

};