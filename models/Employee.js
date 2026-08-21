const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    // =====================================
    // Basic Employee Information
    // =====================================

    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    cnic: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================
    // Organizational Hierarchy
    // =====================================

    employeeType: {
      type: String,
      enum: [
        "Management",
        "Department",
        "Danin Chitral",
        "Dara Adam Khel",
      ],
      default: "Department",
      required: true,
    },

    section: {
      type: String,
      default: "",
      trim: true,
    },

    department: {
      type: String,
      default: "",
      trim: true,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================
    // Reporting Hierarchy
    // =====================================

    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    isManagingDirector: {
      type: Boolean,
      default: false,
    },

    // Controls display order
    order: {
      type: Number,
      default: 0,
    },

    // =====================================
    // Office / Location
    // =====================================

    office: {
      type: String,
      enum: [
        "Chitral",
        "Darra",
        "Head Office",
        "Other",
      ],
      default: "Head Office",
    },

    // =====================================
    // Employee Message / Bio
    // =====================================

    message: {
      type: String,
      default: "",
    },

    // =====================================
    // Joining Information
    // =====================================

    joiningDate: {
      type: Date,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    // =====================================
    // Profile Image
    // =====================================

    profileImage: {
      type: String,
      default: "",
    },

    // =====================================
    // Status
    // =====================================

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Employee",
  employeeSchema
);