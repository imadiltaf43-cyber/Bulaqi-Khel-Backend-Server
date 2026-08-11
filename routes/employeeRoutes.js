const express = require("express");

const router = express.Router();

const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// =====================================
// Public Routes
// =====================================

router.get("/", getEmployees);

router.get("/:id", getEmployee);

// =====================================
// Admin Routes
// =====================================

router.post(
  "/",
  protect,
  upload.single("profileImage"),
  createEmployee
);

router.put(
  "/:id",
  protect,
  upload.single("profileImage"),
  updateEmployee
);

router.delete(
  "/:id",
  protect,
  deleteEmployee
);

module.exports = router;