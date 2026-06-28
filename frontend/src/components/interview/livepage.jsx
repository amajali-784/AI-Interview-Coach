import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs";
import "./LivePage.css";

// Import GIFs
import idleGif from "./listenig.gif";
import listeningGif from "./listenig.gif";
import sayingGif from "./saying.gif";

// Text-to-Speech setup
const synth = window.speechSynthesis;

const LivePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(""); // Current Question
  const [answer, setAnswer] = useState(""); // User's Answer
  const [allAnswers, setAllAnswers] = useState([]); // Collected Q&A
  const [currentGif, setCurrentGif] = useState(idleGif);
  const webcamRef = useRef(null);
  const [faceDetector, setFaceDetector] = useState(null);

  const gifPaths = {
    idle: idleGif,
    listening: listeningGif,
    saying: sayingGif,
  };

  // Initialize face detector
  useEffect(() => {
    const loadFaceDetector = async () => {
      const detector = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, {
        runtime: "tfjs",
      });
      setFaceDetector(detector);
    };

    loadFaceDetector();
  }, []);

  // Check authentication and fetch user data
  useEffect(() => {
    if (!userId || userId.trim() === "") {
      navigate("/signin");
    } else {
      axios
        .get(`http://localhost:5000/api/users/profile/${userId}`)
        .then(() => {
          setLoading(false);
          fetchNextQuestion(); // Start interview
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("Failed to load user data. Redirecting to login.");
          navigate("/signin");
        });
    }
  }, [userId, navigate]);

  // Monitor face detection
  useEffect(() => {
    const detectFace = async () => {
      if (webcamRef.current && faceDetector) {
        const video = webcamRef.current.video;
        if (video.readyState === 4) {
          const faces = await faceDetector.estimateFaces(video);
          if (faces.length === 0) {
            alert("No User Detected! Returning to Dashboard.");
            navigate("/dashboard");
          }
        }
      }
    };

    const interval = setInterval(() => {
      detectFace();
    }, 2000);

    return () => clearInterval(interval);
  }, [faceDetector, navigate]);

  // Fetch next question from backend
  const fetchNextQuestion = async () => {
    try {
      setCurrentGif(gifPaths.listening);
      const response = await axios.get(`http://localhost:5000/api/interview/start/${userId}`);
      const nextQuestion = response.data.question;

      setQuestion(nextQuestion);
      speakText(nextQuestion); // Convert question to speech
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      // Removed redundant setTimeout
    }
  };

  // Submit the current answer and fetch the next question
  const handleAnswerSubmission = async () => {
    if (answer.trim() === "") return alert("Please provide an answer!");
  
    try {
      const currentQA = { question, answer };
      setAllAnswers((prevAnswers) => [...prevAnswers, currentQA]);
  
      const response = await axios.post(`http://localhost:5000/api/interview/submit/${userId}`, { answer });
  
      if (response.data.message === "Interview complete. Processing answers...") {
        alert("Interview completed! Ending the interview.");
        handleEndInterview();
      } else {
        setQuestion(response.data.question);
        speakText(response.data.question);
      }
  
      setAnswer(""); // Clear the answer input
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer. Please try again.");
    }
  };
  
  // End interview and navigate to feedback
  const handleEndInterview = async () => {
    try {
        const response = await axios.post("http://localhost:5000/api/interview/end", {
            answers: allAnswers, // Ensure this is an array
        });
        console.log("Feedback:", response.data.feedback);

        // Navigate to feedback page
        navigate("/aifeedback");
    } catch (error) {
        console.error("Error ending interview:", error);
        alert("Failed to end the interview. Please try again.");
    }
};


  // Text-to-Speech function
  const speakText = (text) => {
    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set GIF to "saying" when speech starts
    utterance.onstart = () => {
      setCurrentGif(gifPaths.saying);
    };

    // Set GIF back to "idle" when speech ends
    utterance.onend = () => {
      setCurrentGif(gifPaths.idle);
    };

    synth.speak(utterance);
  };

  // Fullscreen and disabling user actions
  useEffect(() => {
    // Request full-screen mode
    const enterFullScreen = () => {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) { // Chrome and Safari
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) { // IE
        document.documentElement.msRequestFullscreen();
      }
    };

    enterFullScreen();

    // Prevent right-click
    const preventRightClick = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", preventRightClick);

    // Focus on tab when it's inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        alert("Switching tabs is not allowed! Returning to the page.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("contextmenu", preventRightClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="live-page">
      {/* Webcam */}
      <div className="webcam-container">
        <Webcam ref={webcamRef} className="webcam-view" />
      </div>

      {/* GIF Display */}
      <div className="gif-container">
        <img src={currentGif} alt="status gif" />
      </div>

      {/* Question and Answer Display */}
      <div className="qa-container">
        <div className="question-container">
          <h3>Question:</h3>
          <p>{question || "Waiting for question..."}</p>
        </div>

        <div className="answer-container">
          <textarea
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
          <button onClick={handleAnswerSubmission}>Submit Answer</button>
        </div>

        <button className="end-interview-button" onClick={handleEndInterview}>
          End Interview
        </button>
      </div>
    </div>
  );
};

export default LivePage;
