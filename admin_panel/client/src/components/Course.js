import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    duration: '',
    link: '',
    image: null,
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  const handleCourseSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('duration', courseData.duration);
    formData.append('link', courseData.link);
    formData.append('image', courseData.image);

    axios
      .post('http://localhost:5000/api/admin/course', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setCourses([...courses, response.data]);
        alert('Course added successfully');
      })
      .catch((error) => console.error('Error adding course:', error));
  };

  const handleDeleteCourse = (courseId) => {
    axios
      .delete(`http://localhost:5000/api/admin/course/${courseId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setCourses(courses.filter((course) => course._id !== courseId));
        alert('Course deleted');
      })
      .catch((error) => console.error('Error deleting course:', error));
  };

  return (
    <div className="courses-container">
      <h2>Manage Courses</h2>
      <form onSubmit={handleCourseSubmit}>
        <input
          type="text"
          placeholder="Course Title"
          value={courseData.title}
          onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={courseData.description}
          onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Duration"
          value={courseData.duration}
          onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
          required
        />
        <input
          type="url"
          placeholder="Course Link"
          value={courseData.link}
          onChange={(e) => setCourseData({ ...courseData, link: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setCourseData({ ...courseData, image: e.target.files[0] })}
          required
        />
        <button type="submit">Add Course</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Duration</th>
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
                <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Courses;
