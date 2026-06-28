const { parseResume } = require('../utils/resumeParser');
const InterviewData = require('../models/InterviewData');

const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File not provided' });

    const parsedData = await parseResume(req.file.path);
    res.json({ parsedData });
  } catch (error) {
    res.status(500).json({ error: 'Resume processing failed', details: error.message });
  }
};

const saveInterviewData = async (req, res) => {
  try {
    const interviewData = new InterviewData({ ...req.body, userId: req.user.id });
    await interviewData.save();
    res.status(201).json({ message: 'Interview data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data', details: error.message });
  }
};

module.exports = { uploadResume, saveInterviewData };
