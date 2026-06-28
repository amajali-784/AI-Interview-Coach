const express = require('express');
const router = express.Router();
const InterviewData = require('../models/interviewData');
const { User } = require('../models/user');

// POST route to submit interview data
router.post('/submit-interview-data', async (req, res) => {
    const {
      role,
      company,
      skills,
      experience,
      qualification,
      specialization,
      jobRequirements,
      userId,
      parsedData
    } = req.body;
  
    console.log("Received Parsed Data:", parsedData);  // Debugging parsed data
  
    if (!role || !company || !skills || !experience || !qualification || !specialization || !userId) {
      return res.status(400).json({ success: false, message: 'Missing required data' });
    }
  
    let userDetails;
    try {
      userDetails = await User.findById(userId);
      if (!userDetails) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
    } catch (error) {
      console.error("Error retrieving user details:", error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  
    try {
      const interviewData = {
        userId,
        role,
        company,
        skills: skills.split(',').map(skill => skill.trim()),
        experience,
        qualification,
        specialization,
        jobRequirements,
        parsedData,  // Save parsed resume data
        userDetails: {
          name: userDetails.name,
          email: userDetails.email,
          phone: userDetails.phone,
          profile: userDetails.profile
        }
      };
  
      const newInterview = new InterviewData(interviewData);
      await newInterview.save();
      res.status(201).json({ success: true, message: 'Data submitted successfully' });
    } catch (error) {
      console.error("Error in submitting data:", error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  

module.exports = router;
