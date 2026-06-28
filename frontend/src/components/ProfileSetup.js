import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const [step, setStep] = useState(0);
  const [profileData, setProfileData] = useState({
    dob: '',
    location: '',
    qualification: '',
    specialization: '',
    passoutYear: '',
    experience: '',
    skills: '',
  });

  const [otherInputs, setOtherInputs] = useState({
    locationOther: '',
    qualificationOther: '',
    specializationOther: '',
    skillsOther: '',
  });

  const fields = [
    { name: 'dob', label: 'Date of Birth', type: 'date' },
    { name: 'location', label: 'Location', type: 'select', options: ['Karwar, India', 'Bengaluru, India', 'Other'] },
    { name: 'qualification', label: 'Qualification', type: 'select', options: ['Bachelor of Engineering', 'Master of Science', 'MBBS', 'Bachelor of Science', '10th Std', '12th Std', 'Other'] },
    { name: 'specialization', label: 'Specialization', type: 'select', options: ['Computer Science and Eng', 'Electronics and Communication', 'Civil Eng', 'Mechanical Eng', 'AIML Eng', 'Other'] },
    { name: 'passoutYear', label: 'Passout Year', type: 'select', options: Array.from({ length: 41 }, (_, i) => 1989 + i) },
    { name: 'experience', label: 'Experience (Years)', type: 'number' },
    { name: 'skills', label: 'Skills', type: 'select', options: ['C Programming', 'Python', 'Other'] },
  ];

  useEffect(() => {
    if (!userId) {
      alert('UserId is missing. Redirecting to login.');
      navigate('/signin'); // Redirect to login if userId is missing
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOtherChange = (e) => {
    const { name, value } = e.target;
    setOtherInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const currentField = fields[step].name;

    if (profileData[currentField] === 'Other') {
      const otherValue = otherInputs[`${currentField}Other`];
      if (!otherValue) {
        alert(`Please enter the value for "Other" in ${fields[step].label}`);
        return;
      }
      setProfileData((prev) => ({ ...prev, [currentField]: otherValue }));
    }

    if (step < fields.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile-setup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, profileData }),
        });

        const data = await response.json();
        if (response.ok) {
          localStorage.setItem('profileComplete', true);
          alert('Profile Setup Complete');
          navigate('/dashboard');
        } else {
          alert(`Error setting up profile: ${data.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Server Error.');
      }
    }
  };

  return (
    <div className="form-contain">
      <h2>Profile Setup</h2>
      <h3>(One Time Setup)</h3>
      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${((step + 1) / fields.length) * 100}%` }}></div>
      </div>

      <label>{fields[step].label}</label>
      {fields[step].type === 'select' ? (
        <>
          <select name={fields[step].name} value={profileData[fields[step].name]} onChange={handleChange}>
            <option value="">Select {fields[step].label}</option>
            {fields[step].options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {profileData[fields[step].name] === 'Other' && (
            <input
              type="text"
              className="other-input"
              name={`${fields[step].name}Other`}
              placeholder={`Enter other ${fields[step].label}`}
              value={otherInputs[`${fields[step].name}Other`]}
              onChange={handleOtherChange}
            />
          )}
        </>
      ) : (
        <input
          type={fields[step].type}
          name={fields[step].name}
          value={profileData[fields[step].name]}
          onChange={handleChange}
        />
      )}
      <button onClick={handleSubmit}>{step < fields.length - 1 ? 'Next' : 'Submit'}</button>
    </div>
  );
};

export default ProfileSetup;
