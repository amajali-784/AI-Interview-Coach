const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/User'); // Import your user model

// Route to verify user details and set a new password
router.post('/forgot-password', async (req, res) => {
  try {
    const { name, email, phone, newPassword, confirmPassword } = req.body;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Verify user details
    const user = await User.findOne({ name, email, phone });
    if (!user) {
      return res.status(404).json({ message: "User details not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
