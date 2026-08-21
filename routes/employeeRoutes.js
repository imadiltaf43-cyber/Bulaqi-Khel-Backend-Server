const express = require("express");

const router = express.Router();

const {
  getEmployees,
  getEmployee,
  getOrganization,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// =====================================
// Public Routes
// =====================================

// Organization hierarchy
// IMPORTANT: This must come BEFORE /:id
router.get("/organization", getOrganization);

// All employees
router.get("/", getEmployees);

// Single employee
router.get("/:id", getEmployee);


// =====================================
// Admin Routes
// =====================================

// Add employee
router.post(
  "/",
  protect,
  upload.single("profileImage"),
  createEmployee
);

// Update employee
router.put(
  "/:id",
  protect,
  upload.single("profileImage"),
  updateEmployee
);

// Delete employee
router.delete(
  "/:id",
  protect,
  deleteEmployee
);

module.exports = router;