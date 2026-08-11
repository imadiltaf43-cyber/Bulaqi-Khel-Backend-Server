const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const { uploadFiles } = require("../utils/CloudinaryUploads");
// =====================================
// Apply for Job
// =====================================

exports.applyJob = async (req, res) => {

  console.log("NEW APPLY JOB CONTROLLER");

  try {

    const job = await Job.findById(req.body.job);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (new Date(job.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Job deadline has expired.",
      });
    }

    // Cloudinary URL
    const cvUrl = req.file ? req.file.path : "";

    const application = await JobApplication.create({

      job: req.body.job,

      fullName: req.body.fullName,

      email: req.body.email,

      phone: req.body.phone,

      city: req.body.city,

      address: req.body.address,

      qualification: req.body.qualification,

      experience: req.body.experience,

      coverLetter: req.body.coverLetter,

      cv: cvUrl,

    });

    res.status(201).json({

      success: true,

      message: "Application submitted successfully.",

      application,

    });

  } catch (err) {

    console.error(err);

    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};
// =====================================
// Get All Applications
// =====================================

exports.getApplications = async (req, res) => {

  try {

    const applications =
      await JobApplication.find()

        .populate("job")

        .sort({
          createdAt: -1,
        });

    res.json(applications);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// =====================================
// Get Applications of One Job
// =====================================

exports.getJobApplications = async (
  req,
  res
) => {

  try {

    const applications =
      await JobApplication.find({
        job: req.params.jobId,
      }).sort({
        createdAt: -1,
      });

    res.json(applications);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// =====================================
// Update Application Status
// =====================================

exports.updateApplicationStatus =
  async (req, res) => {

    try {

      const application =
        await JobApplication.findByIdAndUpdate(

          req.params.id,

          {
            status: req.body.status,
          },

          {
            new: true,
          }

        );

      res.json({
        success: true,
        application,
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  };

// =====================================
// Delete Application
// =====================================

exports.deleteApplication = async (req, res) => {
  try {

    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.deleteOne();

    res.json({
      success: true,
      message: "Application deleted successfully",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

  // =====================================
// Get Single Application
// =====================================

exports.getApplication = async (req, res) => {
  try {

    const application = await JobApplication
      .findById(req.params.id)
      .populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json(application);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

exports.getApplicationsByJob = async (req, res) => {

  try {

    const applications = await JobApplication.find({
      job: req.params.jobId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};