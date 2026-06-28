import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserCoursePage.css"; // Import the custom CSS for styling

const UserCoursePage = () => {
  const [courses, setCourses] = useState([]);

  // Fetch all available courses
  const fetchCourses = async () => {
    try {
      const { data } = await axios.get("/api/courses");
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Handle starting the course and opening the link
  const handleStart = (courseLink) => {
    window.open(courseLink, "_blank");
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="courses-container">
      <h1 className="courses-title">Available Courses</h1>
      <p className="note">Note : The Below Courses are for Your Reference Only Platform Is Not Liable For Any Kind of Loss</p>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <div className="course-image-container">
              <img
                src={course.image ? course.image : "/default-image.png"}
                alt={course.title}
                className="course-image"
              />
            </div>
            <div className="course-details">
              <h3 className="course-title">{course.title}</h3>
              <p className="course-description">{course.description}</p>
              <p className="course-duration">{course.duration}</p>
            </div>
            <button className="start-button" onClick={() => handleStart(course.link)}>
              Start Course
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserCoursePage;
