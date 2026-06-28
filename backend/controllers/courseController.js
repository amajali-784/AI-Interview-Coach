const Course = require("../models/Course");

// Add a new cours
const addCourse = async (req, res) => {
    try {
      // Log incoming request body and file
      console.log("Received request data:", req.body);
      console.log("Received file data:", req.file);
  
      // Check if the file and required fields are present
      if (!req.file) {
        return res.status(400).json({ message: "Image is required." });
      }
  
      if (!req.body.title || !req.body.link) {
        return res.status(400).json({ message: "Title and link are required." });
      }
  
      // Create a new course object
      const newCourse = new Course({
        title: req.body.title,
        description: req.body.description,
        duration: req.body.duration,
        link: req.body.link,
        image: `/uploads/${req.file.filename}`,
      });
  
      // Save the course to the database
      await newCourse.save();
      res.status(201).json({ message: "Course added successfully!", course: newCourse });
    } catch (error) {
      console.error("Error adding course:", error.message);
      res.status(500).json({ message: "Failed to add course.", error: error.message });
    }
  };
  
// Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
  }
};

// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    await Course.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete course", error: error.message });
  }
};

module.exports = { addCourse, getCourses, deleteCourse };
