const User = require('../models/User');
const Course = require('../models/Course');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = { username: 'admin', password: 'adminpassword' }; // Replace with environment variables or DB for security

  if (username === admin.username && password === admin.password) {
    const token = jwt.sign({ role: 'admin' }, 'secretkey', { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Delete user
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ message: 'User deleted' });
};

// Edit user password
exports.editUserPassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  await user.save();
  res.json({ message: 'Password updated' });
};

// Add course
exports.addCourse = async (req, res) => {
  const { title, description, duration, link } = req.body;
  const newCourse = new Course({ title, description, duration, link });
  await newCourse.save();
  res.json(newCourse);
};

// Get all courses
exports.getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

// Delete course
exports.deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json({ message: 'Course deleted' });
};
