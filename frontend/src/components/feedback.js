import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirect
import './feedback.css'; // Import the custom CSS file

const FeedbackPage = () => {
  const [feedback, setFeedback] = useState({
    performance: 0,
    security: 0,
    support: 0,
    usefulness: 0,
    note: "",
  });

  const [message, setMessage] = useState(""); // Feedback message
  const navigate = useNavigate(); // Use navigate for redirection

  const handleStarClick = (category, value) => {
    setFeedback({ ...feedback, [category]: value });
  };

  const handleInputChange = (e) => {
    setFeedback({ ...feedback, note: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send feedback data to the server
      await axios.post("http://localhost:5000/api/feedback", feedback);
      
      // Show success message
      setMessage("Thanks for your feedback!");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      // Reset the form after submission
      setFeedback({
        performance: 0,
        security: 0,
        support: 0,
        usefulness: 0,
        note: "",
      });

    } catch (error) {
      // Show error message if feedback submission fails
      setMessage("Failed to submit feedback. Please try again.");
    }
  };

  const renderStars = (category) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        onClick={() => handleStarClick(category, i + 1)}
        className={`star ${feedback[category] > i ? "star-filled" : ""}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="feedback-page">
      <h2 className="feedback-title">User Feedback</h2>
      
      {/* Show feedback message */}
      {message && <p className={`feedback-message ${message.includes("Thanks") ? "success" : "error"}`}>{message}</p>}
      
      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="feedback-item">
          <label className="feedback-label">Performance:</label>
          <div className="feedback-stars">{renderStars("performance")}</div>
        </div>
        <div className="feedback-item">
          <label className="feedback-label">Security:</label>
          <div className="feedback-stars">{renderStars("security")}</div>
        </div>
        <div className="feedback-item">
          <label className="feedback-label">Support:</label>
          <div className="feedback-stars">{renderStars("support")}</div>
        </div>
        <div className="feedback-item">
          <label className="feedback-label">Usefulness:</label>
          <div className="feedback-stars">{renderStars("usefulness")}</div>
        </div>
        <div className="feedback-item">
          <label className="feedback-label">Additional Notes:</label>
          <textarea
            className="feedback-textarea"
            value={feedback.note}
            onChange={handleInputChange}
            rows="4"
            cols="50"
          ></textarea>
        </div>
        <button className="feedback-submit" type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackPage;
