const { User } = require('../models/User');
const {Course } = require('../models/Course');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Modify user password
exports.modifyPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID.' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Start a course
exports.startCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user._id; // Assuming the user is authenticated and req.user is set by middleware

    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }

    // Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if the user is already enrolled in the course
    const alreadyEnrolled = user.enrolledCourses.some((ec) => ec.courseId.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Enroll the user in the course
    user.enrolledCourses.push({
      courseId,
      status: 'Processing', // You can update this status based on your business logic
      startTime: new Date(),
      endTime: new Date(Date.now() + parseDuration(course.duration)), // Parse duration
    });

    await user.save();
    res.status(200).json({ success: true, message: 'Course started successfully!' });
  } catch (error) {
    console.error('Error starting course:', error);
    res.status(500).json({ success: false, message: 'Failed to start course', error: error.message });
  }
};

// Fetch user's enrolled courses
exports.getUserCourses = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated
    const user = await User.findById(userId).populate('enrolledCourses.courseId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch courses', error: error.message });
  }
};

// Utility function to parse duration into milliseconds
const parseDuration = (duration) => {
  const [value, unit] = duration.split(' '); // e.g., "2 weeks"
  const multipliers = {
    days: 86400000, // 24 * 60 * 60 * 1000
    weeks: 604800000, // 7 * 24 * 60 * 60 * 1000
    months: 2592000000, // 30 * 24 * 60 * 60 * 1000
  };

  // Ensure that the unit exists in the multipliers
  if (!multipliers[unit]) {
    throw new Error(`Invalid duration unit: ${unit}`);
  }

  return value * multipliers[unit];
};
