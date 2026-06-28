import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminJobApp.css";
const AdminJobApp = () => {
  const API_URL = "http://localhost:5000/api/jobs";

  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    lastDate: "",
    requirements: "",
    applicationLink: "",
    eligibility: "",
    availablePosts: "",
    payout: "",
    logo: null,
  });
  const [message, setMessage] = useState(""); // State to manage feedback messages

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    // Check for empty fields
    if (
      !formData.role ||
      !formData.company ||
      !formData.lastDate ||
      !formData.requirements ||
      !formData.applicationLink ||
      !formData.eligibility ||
      !formData.availablePosts ||
      !formData.payout
    ) {
      setMessage("Please fill out all fields!");
      return;
    }

    try {
      await axios.post(API_URL, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Job added successfully!"); // Success message
      fetchJobs(); // Refresh job list
      setFormData({
        role: "",
        company: "",
        lastDate: "",
        requirements: "",
        applicationLink: "",
        eligibility: "",
        availablePosts: "",
        payout: "",
        logo: null,
      });
    } catch (error) {
      setMessage("Failed to add job. Please try again!"); // Error message
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMessage("Job deleted successfully!"); // Success message for deletion
      fetchJobs(); // Refresh job list
    } catch (error) {
      setMessage("Failed to delete job. Please try again!"); // Error message for deletion
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="admin-job-app-container">
      <h2>Add Job</h2>

      {/* Display feedback message */}
      {message && (
        <p className={`feedback-message ${message.includes("successfully") ? "success" : "error"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="admin-job-form">
        <input
          type="text"
          placeholder="Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
        />
        <input
          type="date"
          value={formData.lastDate}
          onChange={(e) =>
            setFormData({ ...formData, lastDate: e.target.value })
          }
        />
        <textarea
          placeholder="Requirements"
          value={formData.requirements}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Application Link"
          value={formData.applicationLink}
          onChange={(e) =>
            setFormData({ ...formData, applicationLink: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Eligibility"
          value={formData.eligibility}
          onChange={(e) =>
            setFormData({ ...formData, eligibility: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Available Posts"
          value={formData.availablePosts}
          onChange={(e) =>
            setFormData({ ...formData, availablePosts: e.target.value })
          }
        />
        <input
        type="number"
        placeholder="Salary"
        value={formData.payout}
        onChange={(e) =>
          setFormData({ ...formData, payout: e.target.value })
        }
      />
        <input
          type="file"
          onChange={(e) =>
            setFormData({ ...formData, logo: e.target.files[0] })
          }
        />
        <button type="submit">Add Job</button>
      </form>

      <h2>Available Jobs</h2>
      <table className="job-table">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Applied</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.company}</td>
              <td>{job.role}</td>
              <td>{job.appliedCount}</td>
              <td>
                <button onClick={() => handleDelete(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminJobApp;
