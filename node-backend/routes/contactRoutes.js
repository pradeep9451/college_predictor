const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res.status(201).json({ success: true, message: "Message saved successfully!" });
  } catch (err) {
    console.error("Error saving contact:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
