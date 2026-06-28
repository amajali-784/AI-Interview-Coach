// models/Course.js
const mongoose = require('mongoose');

// Course schema
const courseSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  link: { type: String, required: true },
  duration: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});

const Course = mongoose.model('Course', courseSchema, 'Courses');

module.exports = Course;
