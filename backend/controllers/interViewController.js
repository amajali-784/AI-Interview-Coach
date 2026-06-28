const InterviewData = require("../models/InterviewData");  // Import InterviewData model
const { generateQuestion, evaluateAnswers } = require("../helpers/groqHelper");
const { writeQuestionAnswer, clearSessionFile, getSessionFile } = require("../helpers/fileHelper");

let currentQuestionCount = 0; // Keep track of question count
let currentQuestions = [];    // Store the current questions

// Start interview with one question
exports.startInterview = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const candidate = await InterviewData.findOne({ userId });
      if (!candidate) return res.status(404).json({ message: "Candidate not found." });
  
      // Clear previous session data
      clearSessionFile();
      currentQuestions = []; // <-- Add this line to clear previous questions
  
      // Set the question count to 1
      currentQuestionCount = 1;
  
      // Generate and store the first question
      const question = await generateQuestion(candidate.role, candidate.skills, currentQuestionCount);
      currentQuestions.push(question);
  
      // Send the first question to the client
      res.json({ question });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to start interview." });
    }
};
  
// Submit the answer for a question and move to the next question
exports.submitAnswer = async (req, res) => {
    const { answer } = req.body;
    const { userId } = req.params;
  
    if (!answer) return res.status(400).json({ message: "Answer is required." });
  
    const question = currentQuestions[currentQuestionCount - 1];
    if (!question) return res.status(400).json({ message: "No current question found." });
  
    // Store the question and the answer in the session file
    writeQuestionAnswer(question, answer);
  
    currentQuestionCount++;
  
    try {
      const candidate = await InterviewData.findOne({ userId });
      if (!candidate) return res.status(404).json({ message: "Candidate not found." });
  
      if (currentQuestionCount <= 5) {
        const nextQuestion = await generateQuestion(candidate.role, candidate.skills, currentQuestionCount);
        currentQuestions.push(nextQuestion);
        return res.json({ question: nextQuestion });
      } else {
        return res.json({ message: "Interview complete. Processing answers..." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to submit answer." });
    }
  };
  
// End the interview and evaluate answers
exports.endInterview = async (req, res) => {
    try {
        let { answers } = req.body;

        // Validate answers
        if (!Array.isArray(answers)) {
            return res.status(400).json({ message: "'answers' must be an array." });
        }

        const feedback = await evaluateAnswers(answers);

        res.status(200).json({
            message: "Interview ended successfully.",
            feedback,
        });
    } catch (error) {
        console.error("Error ending interview:", error.message);
        res.status(500).json({ error: "Failed to end the interview." });
    }
};
