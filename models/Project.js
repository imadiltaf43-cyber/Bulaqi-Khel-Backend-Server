const mongoose = require("mongoose");

const generateSlug = (value) => {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
};

const projectSchema = new mongoose.Schema(
{
    projectName:{
        type:String,
        required:true,
        trim:true
    },

    category:{
        type:String,
        required:true
    },

    location:{
        type:String,
        default:""
    },

    description:{
        type:String,
        default:""
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

    annualOutput:{
        type:String,
        default:""
    },

    area:{
        type:String,
        default:""
    },

    status:{
        type:String,
        enum:[
            "Active",
            "Completed",
            "Planned",
            "Inactive"
        ],
        default:"Active"
    },

    projectType:{
        type:String,
        default:""
    },

    coordinates:{
        type:String,
        default:""
    },

    timeline:{
        type:String,
        default:""
    },

    slug:{
        type:String,
        default:"",
        unique:true,
        sparse:true
    }

},
{
    timestamps:true
});

projectSchema.pre("validate", function () {

    if (!this.slug && this.projectName) {
        this.slug = generateSlug(this.projectName);
    }

    if (!this.slug) {
        this.slug = `project-${Date.now()}-${Math.round(Math.random() * 100000)}`;
    }

});

module.exports = mongoose.model("Project",projectSchema);