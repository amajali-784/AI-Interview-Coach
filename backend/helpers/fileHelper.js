const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../interview_session.txt");

function writeQuestionAnswer(question, answer) {
    const content = `Question: ${question}\nAnswer: ${answer}\n\n`;
    try {
        fs.appendFileSync(filePath, content, { encoding: "utf8" });
    } catch (error) {
        console.error("Error writing to file:", error.message);
    }
}

function clearSessionFile() {
    try {
        fs.writeFileSync(filePath, "", { encoding: "utf8" });
    } catch (error) {
        console.error("Error clearing file:", error.message);
    }
}

function getSessionFile() {
    try {
        if (!fs.existsSync(filePath)) {
            return ""; // Return empty string if file doesn't exist
        }
        return fs.readFileSync(filePath, "utf8");
    } catch (error) {
        console.error("Error reading file:", error.message);
        return "";
    }
}

module.exports = { writeQuestionAnswer, clearSessionFile, getSessionFile };
