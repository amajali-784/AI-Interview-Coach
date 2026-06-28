import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminCoursePage.css"; // Custom CSS file

const AdminCoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    link: "",
    image: null,
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({
        ...prevData,
        image: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission to add course
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) {
          form.append(key, value);
        }
      });

      await axios.post("/api/courses", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchCourses(); // Refresh course list
      alert("Course added successfully!");
    } catch (error) {
      console.error("Error adding course:", error);
      alert("Failed to add course.");
    }
  };

  // Handle course deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/courses/${id}`);
      fetchCourses(); // Refresh course list
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="admin-page-container">
      <h1 className="admin-page-heading">Admin Course Management</h1>
      

      {/* Course Add Form */}
      <div className="course-add-form-container">
        <form onSubmit={handleSubmit} className="course-form">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            onChange={handleChange}
            required
            className="course-input"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            onChange={handleChange}
            className="course-textarea"
          />
          <input
            type="text"
            name="duration"
            placeholder="Duration (e.g., 2 weeks)"
            onChange={handleChange}
            required
            className="course-input"
          />
          <input
            type="text"
            name="link"
            placeholder="Course Link"
            onChange={handleChange}
            required
            className="course-input"
          />
          <input
            type="file"
            name="image"
            accept="image/png"
            onChange={handleChange}
            className="course-file"
          />
          <button type="submit" className="submit-course-btn">
            Add Course
          </button>
        </form>
      </div>

      {/* Available Courses Table */}
      <div className="courses-table-container">
        <h2 className="available-courses-heading">Available Courses</h2>
        <table className="courses-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.duration}</td>
                <td>
                  <a href={course.link} target="_blank" rel="noopener noreferrer">
                    Open Course
                  </a>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="delete-course-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoursePage;
