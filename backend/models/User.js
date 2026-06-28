const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Profile schema
const profileSchema = mongoose.Schema({
  dob: { type: Date },
  location: { type: String },
  qualification: { type: String },
  specialization: { type: String },
  passoutYear: { type: Number },
  experience: { type: Number },
  skills: [{ type: String }],
});

const enrolledCourseSchema = mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  status: { type: String, enum: ["Not Started", "Processing", "Completed"], default: "Not Started" },
  startTime: { type: Date, default: null },
  endTime: { type: Date, default: null },
});

// User schema
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: profileSchema, default: null },
    enrolledCourses: [enrolledCourseSchema],
  },
  { timestamps: true }
);

// Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Avoid overwriting the model
const User = mongoose.models.User || mongoose.model('User', userSchema, 'SignUp');

module.exports = { User };
