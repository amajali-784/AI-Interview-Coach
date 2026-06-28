import React, { useState, useEffect } from "react";
import ResumeUploader from "./ResumeUploader";
import DataPreviewPopup from "./DataPreviewPopup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./aiInterview.css";

const AIInterviewForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    skills: "",
    experience: "",
    qualification: "",
    specialization: "",
    jobRequirements: "",
    resumeFile: null,
  });
  const [customRole, setCustomRole] = useState("");
  const [customCompany, setCustomCompany] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [isDataConfirmed, setIsDataConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  // Check authentication and fetch user data
  useEffect(() => {
    if (!userId || userId.trim() === "") {
      navigate("/signin");
    } else {
      axios
        .get(`http://localhost:5000/api/users/profile/${userId}`)
        .then((response) => {
          setUser(response.data); // Assuming the API returns user data with email and phone
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          alert("Failed to load user data. Redirecting to login.");
          navigate("/signin");
        });
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (e, type) => {
    const { value } = e.target;
    if (type === "role") {
      setCustomRole(value);
    } else if (type === "company") {
      setCustomCompany(value);
    }
  };

  const handleFileUpload = (file) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }));
    handleResumeAnalysis(file);
  };

  const handleResumeAnalysis = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai-resume-analyzer",
        formData
      );
      if (response.data.success) {
        setParsedData(response.data.parsedData);
      } else {
        alert("Failed to analyze the resume.");
      }
    } catch (error) {
      console.error("Resume Analysis Error:", error);
      alert("Error during resume analysis.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDataConfirmed || !parsedData) {
      alert("Please confirm the parsed resume data first.");
      return;
    }

    if (!user) {
      alert("Please login to submit your data.");
      navigate("/signin");
      return;
    }

    try {
      const submissionData = {
        ...formData,
        role: formData.role === "Other" ? customRole : formData.role,
        company: formData.company === "Other" ? customCompany : formData.company,
        parsedData,
        userId: user._id, // Using the user ID from the fetched user data
        email: user.email, // User's email
        phone: user.phone, // User's phone number
      };

      const response = await axios.post(
        "http://localhost:5000/api/as/submit-interview-data",
        submissionData
      );

      if (response.data.success) {
        alert("Data submitted successfully.");
        navigate("/rulepage");
      } else {
        alert(response.data.message || "Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error submitting data. Please check console logs for details.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ai-interview-wrapper">
      <form className="ai-interview-form" onSubmit={handleSubmit}>
        <h2 className="form-title">AI Interview Begin Data Page</h2>

        {/* Role */}
        <label className="input-label">Role:</label>
        <select
          className="form-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Software Engineer">Software Engineer</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="App Tester">App Tester</option>
          <option value="Python Developer">Python Developer</option>
          <option value="Other">Other</option>
        </select>

        {formData.role === "Other" && (
          <input
            className="form-input"
            type="text"
            value={customRole}
            onChange={(e) => handleCustomChange(e, "role")}
            placeholder="Enter custom role"
            required
          />
        )}

        {/* Company */}
        <label className="input-label">Company:</label>
        <select
          className="form-select"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        >
          <option value="">Select Company</option>
          <option value="Google">Google</option>
          <option value="Microsoft">Microsoft</option>
          <option value="TCS">TCS</option>
          <option value="HP">HP</option>
          <option value="Other">Other</option>
        </select>

        {formData.company === "Other" && (
          <input
            className="form-input"
            type="text"
            value={customCompany}
            onChange={(e) => handleCustomChange(e, "company")}
            placeholder="Enter custom company"
            required
          />
        )}

        {/* Skills */}
        <label className="input-label">Skills:</label>
        <input
          className="form-input"
          type="text"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Enter Skills (comma separated)"
        />

        {/* Experience */}
        <label className="input-label">Experience (years):</label>
        <input
          className="form-input"
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />

        {/* Qualification */}
        <label className="input-label">Qualification:</label>
        <input
          className="form-input"
          type="text"
          name="qualification"
          value={formData.qualification}
          onChange={handleChange}
        />

        {/* Specialization */}
        <label className="input-label">Specialization:</label>
        <input
          className="form-input"
          type="text"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
        />

        {/* Job Requirements */}
        <label className="input-label">Job Requirements:</label>
        <textarea
          className="form-textarea"
          name="jobRequirements"
          value={formData.jobRequirements}
          onChange={handleChange}
        />

        {/* ResumeUploader Component */}
        <ResumeUploader onFileUpload={handleFileUpload} />

        {formData.resumeFile && (
          <div className="file-info">
            <p className="file-info-text">Uploaded File: {formData.resumeFile.name}</p>
          </div>
        )}

        {/* Data Preview and Confirmation Popup */}
        {parsedData && !isDataConfirmed && (
          <DataPreviewPopup
            data={parsedData}
            onConfirm={() => setIsDataConfirmed(true)}
          />
        )}

        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AIInterviewForm;
