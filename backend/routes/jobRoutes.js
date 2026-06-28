const express = require('express');
const multer = require('multer');
const Job = require('../models/Job');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Add a new job
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const { role, company, lastDate, requirements, applicationLink, eligibility, availablePosts,payout } = req.body;
    const newJob = new Job({
      role,
      company,
      lastDate,
      requirements,
      applicationLink,
      eligibility,
      availablePosts,
      payout,
      logo: req.file?.path || null,
    });
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add job' });
  }
});
router.post('/:id/apply', async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }
  
      if (job.appliedCount >= job.availablePosts) {
        return res.status(400).json({ error: 'Job not available' });
      }
  
      // Increment applied count
      job.appliedCount += 1;
      await job.save();
  
      res.status(200).json({ message: 'Application successful', appliedCount: job.appliedCount });
    } catch (error) {
      res.status(500).json({ error: 'Failed to apply for the job' });
    }
  });
// Delete a job by ID
router.delete('/:id', async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

module.exports = router;
