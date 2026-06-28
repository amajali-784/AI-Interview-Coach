const {User} = require('../models/User');
const bcrypt = require('bcrypt');

// Sign Up
exports.signup = async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists.' });

    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Sign In
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const profileComplete = !!user.profile; // Check if the profile field exists and is filled

    res.status(200).json({
      message: 'Login successful',
      userId: user._id,
      profileComplete,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Profile Setup
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.setupProfile = async (req, res) => {
  const { userId, profileData } = req.body;

  try {
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid UserId format.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.profile = profileData;
    await user.save();

    res.status(200).json({ message: 'Profile setup completed successfully.', profileComplete: true });
  } catch (error) {
    console.error('Profile setup error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId, '-password'); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
/**
 * Updates a user's profile information.
 * @param {Object} req - The request object, containing the userId and profileData in the body.
 * @param {Object} res - The response object.
 */
// Update Profile
exports.updateProfile = async (req, res) => {
  const { userId, profileData } = req.body;

  try {
    // Validate the user ID format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid UserId format.' });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile with the provided profileData
    if (profileData) {
      // Updating profile fields
      user.profile.location = profileData.location || user.profile.location;
      user.profile.skills = profileData.skills || user.profile.skills;
      user.profile.experience = profileData.experience || user.profile.experience;
      user.profile.qualification = profileData.qualification || user.profile.qualification;
      user.profile.specialization = profileData.specialization || user.profile.specialization;
      user.profile.passoutYear = profileData.passoutYear || user.profile.passoutYear;
    }

    // Optionally update other fields like email, phone, name, and password
    user.email = profileData.email || user.email;
    user.phone = profileData.phone || user.phone;
    user.name = profileData.name || user.name;
    if (profileData.password) {
      user.password = profileData.password; // Hash password if updated
    }

    // Save the updated user data
    await user.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
