const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateQuestion(role, skills, count) {
   // const prompt = `Just Provide Single Question each Time I asks..Generate a single interview question for the role of ${role} requiring skill: ${skills.join(", ")}. ${count}.`;
    const prompt = `Just provide a single interview question for the role of ${role} requiring the skills: ${skills.join(", ")}. Please provide only one question each time. dont say i had provided only one question like this Think its as InterView Going On And Give WIth user friendly Just A Single Question.`;

    try {
      const response = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama3-8b-8192",
      });
  
      // Return only one question from the response
      return response.choices[0]?.message?.content || "No question generated.";
    } catch (error) {
      console.error("Groq Error:", error.message);
      throw new Error("Failed to generate question.");
    }
  }
  

  async function evaluateAnswers(answers) {
    console.log("Received answers for evaluation:", answers);

    // Validate if 'answers' is an array
    if (!Array.isArray(answers)) {
        throw new Error("Invalid data: 'answers' must be an array.");
    }

    const prompt = `Evaluate the following answers for an interview:
    ${answers.map((a, i) => `Q${i + 1}: ${a}`).join("\n")}.
    Provide feedback, a score out of 100, and eligibility comments.`;

    try {
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama3-8b-8192",
        });

        return response.choices[0]?.message?.content || "No feedback generated.";
    } catch (error) {
        console.error("Groq Error:", error.message);
        throw new Error("Failed to evaluate answers.");
    }
}


module.exports = { generateQuestion, evaluateAnswers };
