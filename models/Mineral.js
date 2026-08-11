const mongoose = require("mongoose");

const mineralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    shortDescription: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    gallery: [
  {
    url: {
      type: String,
    },
    public_id: {
      type: String,
    },
  },
  ],

    category: {
      type: String,
      default: "General",
    },

    purity: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    hardness: {
      type: String,
      default: "",
    },

    uses: {
      type: [String],
      default: [],
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

module.exports = mongoose.model("Mineral", mineralSchema);