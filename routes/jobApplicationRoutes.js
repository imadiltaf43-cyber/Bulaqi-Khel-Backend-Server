const express = require("express");

const router = express.Router();

const {
  applyJob,
  getApplications,
  getApplication,
  getJobApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/jobApplicationController");

const {
  uploadCV,
} = require("../middleware/careerUpload");

// ==========================
// Public
// ==========================

router.post(
  "/apply",
  uploadCV,
  applyJob
);

// ==========================
// Admin
// ==========================

router.get("/", getApplications);

router.get("/:id", getApplication);

router.get("/job/:jobId", getJobApplications);

router.get(
    "/job/:jobId",
    getApplicationsByJob
);

router.put("/:id", updateApplicationStatus);



router.delete("/:id", deleteApplication);



module.exports = router;