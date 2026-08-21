const Investor = require("../models/Investor");

// =======================================
// Get All Investors
// =======================================

exports.getInvestors = async (req, res) => {
  try {
    const filter = {};

    if (req.query.village) {
      filter.village = req.query.village;
    }

    const investors = await Investor.find(filter).sort({
      guardianName: 1,
    });

    res.status(200).json({
      success: true,
      count: investors.length,
      investors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Get Single Investor
// =======================================

exports.getInvestor = async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found.",
      });
    }

    res.status(200).json({
      success: true,
      investor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Create Investor
// =======================================

exports.createInvestor = async (req, res) => {
  try {
    const investor = await Investor.create({
      guardianName: req.body.guardianName,
      village: req.body.village,
      shares: req.body.shares,
      remarks: req.body.remarks,
    });

    res.status(201).json({
      success: true,
      message: "Investor added successfully.",
      investor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Update Investor
// =======================================

exports.updateInvestor = async (req, res) => {
  try {
    const investor = await Investor.findByIdAndUpdate(
      req.params.id,
      {
        guardianName: req.body.guardianName,
        village: req.body.village,
        shares: req.body.shares,
        remarks: req.body.remarks,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Investor updated successfully.",
      investor,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Delete Investor
// =======================================

exports.deleteInvestor = async (req, res) => {
  try {
    const investor = await Investor.findByIdAndDelete(req.params.id);

    if (!investor) {
      return res.status(404).json({
        success: false,
        message: "Investor not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Investor deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};