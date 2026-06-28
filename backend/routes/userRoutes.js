// routes/userRoutes.js
const express = require('express');
const { signup, signin, setupProfile, getUserProfile, updateProfile } = require('../controllers/authController');
const { getAllUsers, deleteUser, modifyPassword, startCourse, getUserCourses } = require('../controllers/userController');
const { protect } = require("../middlewares/authMiddleware");  // Ensure this is a function
const upload = require("../middlewares/uploadMiddleware");  // Ensure this is a multer instance

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/profile-setup', setupProfile);
router.get('/profile/:userId', getUserProfile);
router.put('/update-profile', updateProfile);

// User management routes
router.get('/user', getAllUsers); // Fetch all users
router.delete('/:id', deleteUser); // Delete user
router.put('/modify-password/:id', modifyPassword);

// Course routes
router.post("/start", protect, startCourse); // Start a course (requires authentication)
router.get("/courses", protect, getUserCourses); // Fetch enrolled courses (requires authentication)

// File upload route
router.post('/upload', protect, upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

module.exports = router;
