const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  performance: { type: Number, required: true },
  security: { type: Number, required: true },
  support: { type: Number, required: true },
  usefulness: { type: Number, required: true },
  note: { type: String, default: "" },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
