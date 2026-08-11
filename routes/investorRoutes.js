const express = require("express");

const router = express.Router();

const {
  getInvestors,
  getInvestor,
  createInvestor,
  updateInvestor,
  deleteInvestor,
} = require("../controllers/investorController");

// =======================================
// Public Routes
// =======================================

// Get all investors
router.get("/", getInvestors);

// Get single investor
router.get("/:id", getInvestor);

// =======================================
// Admin Routes
// =======================================

// Add investor
router.post("/", createInvestor);

// Update investor
router.put("/:id", updateInvestor);

// Delete investor
router.delete("/:id", deleteInvestor);

module.exports = router;