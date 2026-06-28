import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [popupVisible, setPopupVisible] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const verifyDetails = async () => {
    // Open popup for password input if details are valid
    setPopupVisible(true);
  };

  const resetPassword = async () => {
    const { newPassword, confirmPassword } = passwords;

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userDetails, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful!');
        setPopupVisible(false);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Server error. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <form>
        <label>Name:</label>
        <input type="text" name="name" value={userDetails.name} onChange={handleInputChange} />

        <label>Email:</label>
        <input type="email" name="email" value={userDetails.email} onChange={handleInputChange} />

        <label>Phone Number:</label>
        <input type="text" name="phone" value={userDetails.phone} onChange={handleInputChange} />

        <button type="button" onClick={verifyDetails}>
          Verify Details
        </button>
      </form>

      {/* Password Popup */}
      {popupVisible && (
        <div className="password-popup">
          <h3>Set New Password</h3>
          <label>New Password:</label>
          <input type="password" name="newPassword" onChange={handlePasswordChange} />

          <label>Confirm Password:</label>
          <input type="password" name="confirmPassword" onChange={handlePasswordChange} />

          <button onClick={resetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
