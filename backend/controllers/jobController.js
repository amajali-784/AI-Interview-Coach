const Job = require('../models/Job');

// Add a job post
exports.addJob = async (req, res) => {
  try {
    const { role, company, lastDate, requirements, applicationLink, eligibility, availablePosts } = req.body;
    const logo = req.file?.path; // File path from multer middleware
    const newJob = await Job.create({
      role,
      company,
      lastDate,
      requirements,
      logo,
      applicationLink,
      eligibility,
      availablePosts,
    });
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error });
  }
};

// Get all job posts
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error });
  }
};

// Delete a job post
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error });
  }
};
