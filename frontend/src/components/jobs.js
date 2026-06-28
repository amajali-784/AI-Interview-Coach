import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './jobs.css';

const JobsPage = () => {
  const API_URL = "http://localhost:5000/api/jobs";
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null); // Selected job for popup
  const [message, setMessage] = useState(""); // Feedback message

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

  // Handle apply confirmation
  const handleApplyConfirmation = async (jobId) => {
    try {
      const { data } = await axios.post(`${API_URL}/${jobId}/apply`);
      setMessage(data.message);

      // Refresh job list to update applied count
      fetchJobs();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to apply for the job");
    }

    // Clear message and close modal after 3 seconds
    setTimeout(() => {
      setMessage("");
      setSelectedJob(null);
    }, 3000);
  };

  return (
    <div>
      <h2>Available Jobs</h2>

      {/* Feedback message */}
      {message && <p className={message.includes("successful") ? "green" : "red"}>{message}</p>}

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <img src={`http://localhost:5000/${job.logo}`} alt={`${job.company} logo`} />
            <h3>{job.role}</h3>
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Eligibility:</strong> {job.eligibility}</p>
            <p><strong>Requirements:</strong> {job.requirements}</p>
            <p><strong>Salary: Rs</strong> {job.payout}</p>
            <p><strong>Last Date:</strong> {new Date(job.lastDate).toLocaleDateString()}</p>
            <p><strong>Available Posts:</strong> {job.availablePosts - job.appliedCount}</p>

            {job.appliedCount >= job.availablePosts ? (
              <button disabled>Not Available</button>
            ) : (
              <button onClick={() => setSelectedJob(job)}>Apply</button>
            )}
          </div>
        ))}
      </div>

      {/* Modal for application link */}
      {selectedJob && (
        <div className="modal show">
          <div className="modal-content">
            <h2>Apply for {selectedJob.role}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>

            <iframe
              src={selectedJob.applicationLink}
              title="Application Form"
              style={{ width: "100%", height: "300px", border: "none" }}
            ></iframe>

            <p>Did you successfully apply for this job?</p>
            <button onClick={() => handleApplyConfirmation(selectedJob._id)}>Yes, I Applied</button>
            <button onClick={() => setSelectedJob(null)}>No, Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;
