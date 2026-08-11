const Mineral = require("../models/Mineral");

exports.getMinerals = async (req,res)=>{

try{

const minerals = await Mineral.find();

res.json(minerals);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.getMineral = async(req,res)=>{

try{

const mineral = await Mineral.findById(req.params.id);

res.json(mineral);

}catch(err){

res.status(500).json({message:err.message});

}

};

exports.createMineral = async (req, res) => {
  try {
    const mineral = await Mineral.create({
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      image: req.file ? req.file.path : "",
    });

    res.status(201).json(mineral);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};



exports.updateMineral = async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const mineral = await Mineral.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(mineral);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};




exports.deleteMineral = async(req,res)=>{

try{

await Mineral.findByIdAndDelete(req.params.id);

res.json({message:"Mineral Deleted"});

}catch(err){

res.status(500).json({message:err.message});

}

};