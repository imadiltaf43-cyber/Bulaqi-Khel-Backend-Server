const express = require("express");

const router = express.Router();

const {
  submitContact,
  getMessages,
  getMessage,
  updateMessageStatus,
  deleteMessage,
} = require("../controllers/contactController");

// Public
router.post("/", submitContact);

// Admin
router.get("/", getMessages);

router.get("/:id", getMessage);

router.patch("/:id/status", updateMessageStatus);

router.delete("/:id", deleteMessage);

module.exports = router;