const mongoose = require("mongoose");

const investorSchema = new mongoose.Schema(
{
    guardianName:{
        type:String,
        required:true,
        trim:true,
    },

    village:{
        type:String,
        enum:["Barkali","Attariwal"],
        required:true,
    },

    shares:{
        type:Number,
        required:true,
        min:1,
    },

    remarks:{
        type:String,
        default:"",
    }

},
{
    timestamps:true,
}
);

module.exports = mongoose.model("Investor", investorSchema);