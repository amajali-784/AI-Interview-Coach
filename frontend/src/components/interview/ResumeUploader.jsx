import React from "react";

const ResumeUploader = ({ onFileUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div>
      <label>Upload Resume (PDF/DOCX):</label>
      <input type="file" accept=".pdf,.docx" onChange={handleFileChange} />
    </div>
  );
};

export default ResumeUploader;
