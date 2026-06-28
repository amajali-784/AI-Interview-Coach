const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  comments: { type: String, default: '' },
  ratings: {
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
  },
});

const interviewDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: String,
  company: String,
  skills: [String],
  experience: Number,
  qualification: String,
  specialization: String,
  jobRequirements: String,
  parsedData: {
    name: String,
    email: String,
    phone: String,
    linkedIn: String,
    objective: String,
    skills: [String],
    experience: [String],
    education: [String],
    certifications: [String],
    projects: [String],
    languages: [String],
  },
  userDetails: {
    name: String,
    email: String,
    phone: String,
    profile: String,
  },
  feedback: feedbackSchema,
  overallScore: { type: Number, default: 0 },
});

const InterviewData = mongoose.models.InterviewData || mongoose.model('InterviewData', interviewDataSchema);

module.exports = InterviewData;
