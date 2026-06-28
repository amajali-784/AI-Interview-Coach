const express = require('express');
const { login, getUsers, deleteUser, editUserPassword, addCourse, getCourses, deleteCourse } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Admin Login
router.post('/login', login);

// Users
router.get('/users', verifyAdmin, getUsers);
router.delete('/user/:id', verifyAdmin, deleteUser);
router.put('/user/password/:id', verifyAdmin, editUserPassword);

// Courses
router.post('/course', verifyAdmin, addCourse);
router.get('/courses', verifyAdmin, getCourses);
router.delete('/course/:id', verifyAdmin, deleteCourse);

module.exports = router;
