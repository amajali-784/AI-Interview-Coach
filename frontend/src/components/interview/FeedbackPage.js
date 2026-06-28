import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FeedbackPage.css';

function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/signin'); // Redirect if not logged in
        return;
      }

      // Randomly generate ratings for Communication, Technical, and Problem Solving
      const generateRandomRating = () => Math.floor(Math.random() * 10) + 1;
      const communicationRating = generateRandomRating();
      const technicalRating = generateRandomRating();
      const problemSolvingRating = generateRandomRating();

      // Calculate overall score (simple average of the three ratings)
      const overallScore = Math.round(
        (communicationRating + technicalRating + problemSolvingRating) / 3
      );

      // Static feedback data with dynamic ratings
      const staticFeedback = {
        feedback: {
          comments: "Good technical knowledge and communication. Needs to improve problem-solving approach.",
          ratings: {
            communication: communicationRating,
            technical: technicalRating,
            problemSolving: problemSolvingRating,
          },
        },
        overallScore: overallScore,
      };

      // Simulating a successful fetch
      setFeedbackData(staticFeedback);
    };

    fetchFeedback();
  }, [navigate]);

  const renderCircularProgress = (rating) => {
    const strokeDasharray = 440; // Circumference of the circle (2 * Math.PI * 70)
    const strokeDashoffset = strokeDasharray - (strokeDasharray * rating) / 10;

    return (
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" stroke="#e6e6e6" strokeWidth="10" fill="none" />
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="#4caf50"
          strokeWidth="10"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 60 60)"
        />
        <text x="50%" y="50%" alignmentBaseline="middle" textAnchor="middle" fontSize="20" fill="#333">
          {rating}/10
        </text>
      </svg>
    );
  };

  return (
    <div className="feedback-page">
      {error ? (
        <div className="error-message">
          <h3>{error}</h3>
          <button onClick={() => navigate('/dashboard')}>Return to Dashboard</button>
        </div>
      ) : feedbackData ? (
        <div className="feedback-container">
          <h2>Interview Feedback</h2>

          <h3>Feedback</h3>
          <p><strong>Comments:</strong> {feedbackData.feedback.comments}</p>

          <div className="ratings-container">
            <div className="rating">
              <h4>Communication</h4>
              {renderCircularProgress(feedbackData.feedback.ratings.communication)}
            </div>
            <div className="rating">
              <h4>Technical</h4>
              {renderCircularProgress(feedbackData.feedback.ratings.technical)}
            </div>
            <div className="rating">
              <h4>Problem Solving</h4>
              {renderCircularProgress(feedbackData.feedback.ratings.problemSolving)}
            </div>
          </div>

          <p><strong>Overall Score:</strong> {feedbackData.overallScore}/100</p>

          <button onClick={() => navigate('/dashboard')} className="return-button">
            Return to Dashboard
          </button>
        </div>
      ) : (
        <div>Loading feedback...</div>
      )}
    </div>
  );
}

export default FeedbackPage;
