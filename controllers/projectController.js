const Project = require("../models/Project");
const { uploadFiles } = require("../utils/CloudinaryUploads");

// =======================================
// Get All Projects
// =======================================

exports.getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.search) {
      query.$or = [
        {
          projectName: {
            $regex: req.query.search,
            $options: "i",
          },
        },
        {
          category: {
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

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      projects,
      page,
      pages: Math.ceil(total / limit),
      total,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

// =======================================
// Get Single Project
// =======================================

exports.getProject = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// =======================================
// Create Project
// =======================================

exports.createProject = async (req, res) => {

  try {

    let gallery = [];

if (req.files?.gallery) {

    gallery = await uploadFiles(

        req.files.gallery,

        "United-Bulaqi-Khel/Projects"

    );

}

    const project = await Project.create({

      projectName: req.body.projectName,

      category: req.body.category,

      projectType: req.body.projectType,

      location: req.body.location,

      coordinates: req.body.coordinates,

      description: req.body.description,

      annualOutput: req.body.annualOutput,

      area: req.body.area,

      status: req.body.status,

      timeline: req.body.timeline,

      gallery,

    });

    res.status(201).json({

      success: true,

      message: "Project created successfully.",

      project,

    });

  } catch (err) {

  console.error("========== CREATE JOB ERROR ==========");
  console.error(err);

  res.status(500).json({

    success: false,

    message: err.message,

    stack: err.stack,

    name: err.name,

    body: req.body,

    file: req.file,

  });

}

};

// =======================================
// Update Project
// =======================================

exports.updateProject = async (req, res) => {

  try {

    const project = await Project.findById(req.params.id);

    if (!project) {

      return res.status(404).json({

        message: "Project not found",

      });

    }

    const updateData = {

      projectName: req.body.projectName,

      category: req.body.category,

      projectType: req.body.projectType,

      location: req.body.location,

      coordinates: req.body.coordinates,

      description: req.body.description,

      annualOutput: req.body.annualOutput,

      area: req.body.area,

      status: req.body.status,

      timeline: req.body.timeline,

    };

    if (req.files && req.files.gallery) {
      updateData.gallery = await uploadFiles(
        req.files.gallery,
        "United-Bulaqi-Khel/Projects"
      );
    }

    const updatedProject = await Project.findByIdAndUpdate(

      req.params.id,

      updateData,

      {
        new: true,
      }

    );

    res.json({

      success: true,

      message: "Project updated successfully.",

      project: updatedProject,

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};

// =======================================
// Delete Project
// =======================================

exports.deleteProject = async (req, res) => {

  try {

    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {

      return res.status(404).json({

        message: "Project not found",

      });

    }

    res.json({

      success: true,

      message: "Project deleted successfully.",

    });

  } catch (err) {

    res.status(500).json({

      message: err.message,

    });

  }

};