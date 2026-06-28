const express = require("express");
const router = express.Router();
const { startInterview, submitAnswer, endInterview } = require("../controllers/interViewController");


// Routes
router.get("/start/:userId", startInterview); // Start interview
router.post("/submit/:userId", submitAnswer); // Submit answer
router.post("/end", endInterview); // End interview

module.exports = router;



