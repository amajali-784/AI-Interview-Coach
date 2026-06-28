// routes/courseRoutes.js
const express = require("express");
const { addCourse, getCourses, deleteCourse } = require("../controllers/courseController");
const upload = require("../middlewares/uploadMiddleware"); // Middleware for image upload

const router = express.Router();

router.post("/", upload.single("image"), addCourse); // Add a new course
router.get("/", getCourses); // Get all courses
router.delete("/:id", deleteCourse); // Delete a course

module.exports = router;
