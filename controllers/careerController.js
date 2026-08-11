const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");

const cloudinary = require("../config/cloudinary");

// ======================================================
// Helper Functions
// ======================================================

const parseArray = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) return value;

  try {
    return JSON.parse(value);
  } catch {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
};

const uploadImageToCloudinary = async (file) => {
  if (!file) return "";

  if (typeof file === "string") {
    if (/^(https?:)?\/\//i.test(file)) {
      return file;
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "United-Bulaqi-Khel/Careers",
      resource_type: "auto",
    });

    return result.secure_url;
  }

  if (typeof file?.path === "string" && /^(https?:)?\/\//i.test(file.path)) {
    return file.path;
  }

  if (file?.secure_url) {
    return file.secure_url;
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "United-Bulaqi-Khel/Careers",
    resource_type: "auto",
  });

  return result.secure_url;
};

// ======================================================
// GET ALL JOBS
// ======================================================

exports.getJobs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const query = {};

    // ================= Search =================

    if (req.query.search) {
      query.$or = [
        {
          title: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          department: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: req.query.search,
            $options: "i",
          },
        },
      ];
    }

    // ================= Department =================

    if (req.query.department) {
      query.department = req.query.department;
    }

    // ================= Employment Type =================

    if (req.query.type) {
      query.employmentType = req.query.type;
    }

    // ================= Featured =================

    if (req.query.featured) {
      query.featured = req.query.featured === "true";
    }

    // ================= Client Active Jobs =================

    if (req.query.active === "true") {
      query.isActive = true;

      query.deadline = {
        $gte: new Date(),
      };
    }

    const total = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const totalApplications =
          await JobApplication.countDocuments({
            job: job._id,
          });

        const today = new Date();

        const deadline = new Date(job.deadline);

        const remainingDays = Math.ceil(
          (deadline - today) /
            (1000 * 60 * 60 * 24)
        );

        return {
          ...job.toObject(),

          totalApplications,

          expired: deadline < today,

          remainingDays:
            remainingDays > 0
              ? remainingDays
              : 0,
        };
      })
    );

    res.json({
      success: true,

      jobs: jobsWithStats,

      page,

      pages: Math.ceil(total / limit),

      total,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// GET SINGLE JOB
// ======================================================

exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const totalApplications =
      await JobApplication.countDocuments({
        job: job._id,
      });

    const today = new Date();

    const deadline = new Date(job.deadline);

    const remainingDays = Math.ceil(
      (deadline - today) /
        (1000 * 60 * 60 * 24)
    );

    res.json({
      success: true,

      job: {
        ...job.toObject(),

        totalApplications,

        expired: deadline < today,

        remainingDays:
          remainingDays > 0
            ? remainingDays
            : 0,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// CREATE JOB
// ======================================================

exports.createJob = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImageToCloudinary(req.file);
    }

    const job = await Job.create({
      title: req.body.title,

      department: req.body.department,

      location: req.body.location,

      employmentType: req.body.employmentType,

      experience: req.body.experience,

      education: req.body.education,

      vacancies: Number(req.body.vacancies || 1),

      salary: req.body.salary,

      description: req.body.description,

      responsibilities: parseArray(
        req.body.responsibilities
      ),

      requirements: parseArray(
        req.body.requirements
      ),

      benefits: parseArray(
        req.body.benefits
      ),

      deadline: req.body.deadline,

      featured:
        req.body.featured === "true" ||
        req.body.featured === true,

      isActive:
        req.body.isActive === "true" ||
        req.body.isActive === true,

      jobImage: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully.",
      job,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// UPDATE JOB
// ======================================================

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const updateData = {
      title: req.body.title,

      department: req.body.department,

      location: req.body.location,

      employmentType:
        req.body.employmentType,

      experience: req.body.experience,

      education: req.body.education,

      vacancies: Number(
        req.body.vacancies || 1
      ),

      salary: req.body.salary,

      description: req.body.description,

      responsibilities: parseArray(
        req.body.responsibilities
      ),

      requirements: parseArray(
        req.body.requirements
      ),

      benefits: parseArray(
        req.body.benefits
      ),

      deadline: req.body.deadline,

      featured:
        req.body.featured === "true" ||
        req.body.featured === true,

      isActive:
        req.body.isActive === "true" ||
        req.body.isActive === true,
    };

    // ================= Upload New Image =================

    if (req.file) {
      updateData.jobImage = await uploadImageToCloudinary(req.file);
    }

    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    res.json({
      success: true,
      message:
        "Job updated successfully.",
      job: updatedJob,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// DELETE JOB
// ======================================================

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Delete all applications of this job

    await JobApplication.deleteMany({
      job: job._id,
    });

    await Job.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: "Job deleted successfully.",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// TOGGLE JOB STATUS
// ======================================================

exports.toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.isActive = !job.isActive;

    await job.save();

    res.json({
      success: true,
      message: `Job ${
        job.isActive ? "activated" : "deactivated"
      } successfully.`,
      job,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// TOGGLE FEATURED JOB
// ======================================================

exports.toggleFeaturedJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    job.featured = !job.featured;

    await job.save();

    res.json({
      success: true,
      message: `Job ${
        job.featured
          ? "marked as featured"
          : "removed from featured"
      }.`,
      job,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================================
// DASHBOARD STATS
// ======================================================

exports.getJobDashboardStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();

    const activeJobs = await Job.countDocuments({
      isActive: true,
      deadline: {
        $gte: new Date(),
      },
    });

    const inactiveJobs = await Job.countDocuments({
      $or: [
        {
          isActive: false,
        },
        {
          deadline: {
            $lt: new Date(),
          },
        },
      ],
    });

    const featuredJobs = await Job.countDocuments({
      featured: true,
    });

    const totalApplications =
      await JobApplication.countDocuments();

    const pendingApplications =
      await JobApplication.countDocuments({
        status: "Pending",
      });

    const shortlistedApplications =
      await JobApplication.countDocuments({
        status: "Shortlisted",
      });

    const interviewApplications =
      await JobApplication.countDocuments({
        status: "Interview",
      });

    const hiredApplications =
      await JobApplication.countDocuments({
        status: "Hired",
      });

    const rejectedApplications =
      await JobApplication.countDocuments({
        status: "Rejected",
      });

    res.json({
      success: true,

      stats: {
        totalJobs,

        activeJobs,

        inactiveJobs,

        featuredJobs,

        totalApplications,

        pendingApplications,

        shortlistedApplications,

        interviewApplications,

        hiredApplications,

        rejectedApplications,
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};