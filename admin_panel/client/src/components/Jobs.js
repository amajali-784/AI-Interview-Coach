import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [jobData, setJobData] = useState({
    role: '',
    company: '',
    package: '',
    location: '',
    description: '',
    companyLogo: null,
    applicationsAvailable: 0,
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/admin/jobs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setJobs(response.data);
      })
      .catch((error) => console.error('Error fetching jobs:', error));
  }, []);

  const handleJobSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('role', jobData.role);
    formData.append('company', jobData.company);
    formData.append('package', jobData.package);
    formData.append('location', jobData.location);
    formData.append('description', jobData.description);
    formData.append('applicationsAvailable', jobData.applicationsAvailable);
    formData.append('companyLogo', jobData.companyLogo);

    axios
      .post('http://localhost:5000/api/admin/job', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setJobs([...jobs, response.data]);
        alert('Job added successfully');
      })
      .catch((error) => console.error('Error adding job:', error));
  };

  const handleDeleteJob = (jobId) => {
    axios
      .delete(`http://localhost:5000/api/admin/job/${jobId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
      })
      .then((response) => {
        setJobs(jobs.filter((job) => job._id !== jobId));
        alert('Job deleted');
      })
      .catch((error) => console.error('Error deleting job:', error));
  };

  return (
    <div className="jobs-container">
      <h2>Manage Jobs</h2>
      <form onSubmit={handleJobSubmit}>
        <input
          type="text"
          placeholder="Job Role"
          value={jobData.role}
          onChange={(e) => setJobData({ ...jobData, role: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Company"
          value={jobData.company}
          onChange={(e) => setJobData({ ...jobData, company: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Package"
          value={jobData.package}
          onChange={(e) => setJobData({ ...jobData, package: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={jobData.location}
          onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
          required
        />
        <textarea
          placeholder="Job Description"
          value={jobData.description}
          onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
          required
        />
        <input
          type="file"
          onChange={(e) => setJobData({ ...jobData, companyLogo: e.target.files[0] })}
          required
        />
        <input
          type="number"
          placeholder="Applications Available"
          value={jobData.applicationsAvailable}
          onChange={(e) => setJobData({ ...jobData, applicationsAvailable: e.target.value })}
          required
        />
        <button type="submit">Add Job</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Company</th>
            <th>Package</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td>{job.role}</td>
              <td>{job.company}</td>
              <td>{job.package}</td>
              <td>
                <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Jobs;
