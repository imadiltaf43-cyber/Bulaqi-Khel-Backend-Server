exports.admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (req.user.role === "Super Admin") {
    return next();
  }

  return res.status(403).json({
    message: "Super Admin Access Only",
  });
};