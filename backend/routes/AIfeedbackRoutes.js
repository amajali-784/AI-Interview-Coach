const express = require("express");
const InterviewData = require("../models/InterviewData");
const { evaluateAnswers } = require("../utils/aiService");
const { readQuestionsAndAnswers } = require("../utils/sessionFileHandler");

const router = express.Router();

// POST route for generating feedback
router.post("/get-feedback", async (req, res) => {
  try {
    const { userId, role, company, skills, experience } = req.body;

    // Read Questions and Answers from File
    const questionsAndAnswers = readQuestionsAndAnswers();
    if (!questionsAndAnswers)
      return res.status(400).json({ error: "No interview data found." });

    // Send to AI for Evaluation
    const aiFeedback = await evaluateAnswers(questionsAndAnswers);

    // Prepare Data to Store
    const feedback = new InterviewData({
      userId,
      role,
      company,
      skills,
      experience,
      feedback: {
        comments: aiFeedback.comments,
        ratings: aiFeedback.ratings,
      },
      overallScore: aiFeedback.overallScore,
    });

    await feedback.save();
    res.status(200).json({ message: "Feedback saved successfully!", feedback });
  } catch (error) {
    console.error("Error generating feedback:", error.message);
    res.status(500).json({ error: "Failed to generate feedback." });
  }
});

// GET route for fetching feedback

//const InterviewData = require("../models/InterviewData");



// Simulate feedback for user "Ankush"
router.get("/get-feedback/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Simulate data for the user "Ankush" (Replace userId check with "ankush" for testing)
    if (userId !== "ankush") {
      return res.status(404).json({ error: "No feedback found." });
    }

    // Hardcoded feedback data for Ankush
    const feedbackData = [
      {
        userId: "ankush",
        role: "Software Engineer",
        company: "TechCorp",
        skills: ["JavaScript", "React", "Node.js"],
        experience: 3,
        feedback: {
          comments: "Great problem-solving skills and clear communication.",
          ratings: {
            communication: 8,
            technical: 7,
            problemSolving: 9,
          },
        },
        overallScore: 85,
      },
    ];

    res.status(200).json({ feedbackData });
  } catch (error) {
    console.error("Error fetching feedback:", error.message);
    res.status(500).json({ error: "Failed to fetch feedback." });
  }
});

module.exports = router;


