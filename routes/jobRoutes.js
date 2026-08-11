const express = require("express");

const router = express.Router();

const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleJobStatus,
  toggleFeaturedJob,
  getJobDashboardStats,
} = require("../controllers/careerController");



const {
  uploadJobImage,
} = require("../middleware/careerUpload");

// ==========================
// Public
// ==========================

router.get("/", getJobs);

router.get("/:id", getJob);

// Dashboard Stats
router.get("/dashboard/stats", getJobDashboardStats);
// Toggle Active/Inactive
router.patch("/:id/status", toggleJobStatus);
// Toggle Featured
router.patch("/:id/featured", toggleFeaturedJob);

// ==========================
// Admin
// ==========================

router.post(
  "/",
  uploadJobImage,
  createJob
);

router.put(
  "/:id",
  uploadJobImage,
  updateJob
);

router.delete("/:id", deleteJob);

module.exports = router;