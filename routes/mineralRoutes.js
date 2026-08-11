const upload = require("../middleware/uploadMiddleware");



const express = require("express");

const router = express.Router();

const {
  getMinerals,
  getMineral,
  createMineral,
  updateMineral,
  deleteMineral,
} = require("../controllers/mineralController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getMinerals);
router.get("/:id", getMineral);

// Admin Routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createMineral
);
router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateMineral
);

router.delete("/:id", protect, admin, deleteMineral);

module.exports = router;