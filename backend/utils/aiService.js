const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function evaluateAnswers(questionsAndAnswers) {
  const prompt = `
Evaluate the following interview questions and answers:
${questionsAndAnswers}

Provide feedback in this JSON format:
{
  "comments": "General feedback on answers.",
  "ratings": {
    "communication": <score out of 10>,
    "technical": <score out of 10>,
    "problemSolving": <score out of 10>
  },
  "overallScore": <score out of 100>
}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });

    console.log("AI Response:", response.choices[0]?.message?.content);
    return JSON.parse(response.choices[0]?.message?.content || "{}");
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error("Failed to evaluate answers.");
  }
}

module.exports = { evaluateAnswers };
