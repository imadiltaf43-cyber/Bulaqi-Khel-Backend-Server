const ContactMessage = require("../models/ContactMessage");

// =======================================
// Submit Contact Message
// =======================================

exports.submitContact = async (req, res) => {
  try {
    const contact = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      contact,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Get All Messages
// =======================================

exports.getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Get Single Message
// =======================================

exports.getMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Update Message Status
// =======================================

exports.updateMessageStatus = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Reply To Message
// =======================================

exports.replyMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      {
        reply: req.body.reply,
        status: "Replied",
        repliedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================================
// Delete Message
// =======================================

exports.deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};