import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import './AdminFeedback.css';  // Ensure you import the CSS file

const AdminFeedbackPage = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/feedback");
        setFeedbackData(data);
        setNotes(data.map((item) => item.note).filter((note) => note));
      } catch (error) {
        console.error("Error fetching feedback data:", error);
      }
    };

    fetchFeedback();
  }, []);

  const calculateAverage = (field) => {
    if (feedbackData.length === 0) return 0;
    const total = feedbackData.reduce((sum, feedback) => sum + feedback[field], 0);
    return (total / feedbackData.length).toFixed(1);
  };

  const chartData = {
    labels: ["Performance", "Security", "Support", "Usefulness"],
    datasets: [
      {
        label: "Average Feedback",
        data: [
          calculateAverage("performance"),
          calculateAverage("security"),
          calculateAverage("support"),
          calculateAverage("usefulness"),
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50"],
      },
    ],
  };

  return (
    <div className="admin-feedback-container">
      <h2 className="admin-feedback-title">Admin Feedback Dashboard</h2>
      <div className="admin-feedback-chart-container">
        <Bar data={chartData} />
      </div>
      <h3 className="admin-feedback-notes-title">User Notes:</h3>
      <ul className="admin-feedback-notes-list">
        {notes.length > 0 ? (
          notes.map((note, index) => <li key={index} className="admin-feedback-note">{note}</li>)
        ) : (
          <p className="admin-feedback-no-notes">No notes submitted yet.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminFeedbackPage;
