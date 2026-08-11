const mongoose = require("mongoose");

const websiteSettingSchema = new mongoose.Schema(
  {
    heroStats: {
      yearsExperience: {
        type: Number,
        default: 10,
      },

      miningSites: {
        type: Number,
        default: 15,
      },

      annualOutput: {
        type: String,
        default: "500K+",
      },

      skilledEmployees: {
        type: Number,
        default: 250,
      },
    },

    heroVideo: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    aboutStats: {
      yearsExperience: {
        type: Number,
        default: 10,
      },

      miningSites: {
        type: Number,
        default: 15,
      },

      skilledEmployees: {
        type: Number,
        default: 250,
      },

      happyClients: {
        type: Number,
        default: 100,
      },
    },

projectStats: {
  projectsCompleted: {
    type: Number,
    default: 100,
  },

  activeProjects: {
    type: Number,
    default: 15,
  },

  annualOutput: {
    type: String,
    default: "500K+",
  },

  commitment: {
    type: String,
    default: "100%",
  },
},

    footer: {
      companyDescription: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      address: {
        type: String,
        default: "",
      },

      facebook: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      youtube: {
        type: String,
        default: "",
      },

      copyright: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "WebsiteSetting",
  websiteSettingSchema
);