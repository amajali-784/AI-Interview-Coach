const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  package: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  companyLogo: { type: String }, // Path to company logo
  applicationsAvailable: { type: Number, required: true },
});

module.exports = mongoose.model('Job', jobSchema);
