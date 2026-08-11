const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
    },

    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "Read",
        "Replied",
        "Closed",
      ],
      default: "New",
    },

    reply: {
      type: String,
      default: "",
    },

    repliedAt: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ContactMessage",
  contactMessageSchema
);

