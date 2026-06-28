const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  lastDate: { type: Date, required: true },
  requirements: { type: String, required: true },
  applicationLink: { type: String, required: true },
  eligibility: { type: String, required: true },
  availablePosts: { type: Number, required: true },
  payout: { type: Number, required: true },
  logo: { type: String }, // Path to the logo file
  appliedCount: { type: Number, default: 0 },
});

module.exports = mongoose.model('Job', JobSchema);
