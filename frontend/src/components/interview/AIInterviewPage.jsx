import React, { useState } from "react";
import AIInterviewForm from "./AIInterviewForm";
import DataPreviewPopup from "./DataPreviewPopup";

const AIInterviewPage = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (formData) => {
    setSubmittedData(formData);
  };

  const handleConfirm = () => {
    console.log("Data Confirmed:", submittedData);
    alert("Data submitted successfully!");
  };

  return (
    <div className="ai-interview-page">
      {!submittedData ? (
        <AIInterviewForm onSubmit={handleSubmit} />
      ) : (
        <DataPreviewPopup data={submittedData} onConfirm={handleConfirm} />
      )}
    </div>
  );
};

export default AIInterviewPage;
