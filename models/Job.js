const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobImage: {
    type: String,
    default: "",
    },

    slug: {
      type: String,
      unique: true,
    },

    department: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "Pakistan",
    },

    employmentType: {
      type: String,
      enum: [
        "Full Time",
        "Part Time",
        "Contract",
        "Internship",
      ],
      default: "Full Time",
    },

    experience: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    vacancies: {
      type: Number,
      default: 1,
    },

    salary: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      required: true,
    },

    responsibilities: [
      {
        type: String,
      },
    ],

    requirements: [
      {
        type: String,
      },
    ],

    benefits: [
      {
        type: String,
      },
    ],

    deadline: {
      type: Date,
      required: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
Generate slug automatically
*/

jobSchema.pre("save", function () {

  if (!this.slug && this.title) {

    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  }

});

module.exports = mongoose.model("Job", jobSchema);