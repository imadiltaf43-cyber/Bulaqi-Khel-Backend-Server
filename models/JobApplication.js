const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    qualification: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      default: "",
    },

    cv: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Shortlisted",
        "Interview",
        "Rejected",
        "Hired",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

/*
Prevent duplicate application
*/

jobApplicationSchema.index(
  {
    job: 1,
    email: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);