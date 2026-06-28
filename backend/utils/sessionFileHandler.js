const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../interview_session.txt");

function readQuestionsAndAnswers() {
  try {
    if (!fs.existsSync(filePath)) return "";

    const content = fs.readFileSync(filePath, "utf8");
    console.log("File Content:", content);
    return content.trim();
  } catch (error) {
    console.error("Error reading file:", error.message);
    return "";
  }
}

module.exports = { readQuestionsAndAnswers };
