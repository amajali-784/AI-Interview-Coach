import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import logo from './logo.png'; // Assuming you have a logo in your `src` folder

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const { userId, profileComplete } = data;
        localStorage.setItem('userId', userId);
        localStorage.setItem('profileComplete', profileComplete);

        if (profileComplete) {
          navigate('/dashboard');
        } else {
          navigate('/ProfileSetup');
        }
      } else {
        setMessage(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error connecting to server.');
    }
  };

  return (
    <div className="signin-container">
      {/* Header Section */}
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>AI-Powered Job Interview Coach</h1>
      </header>

      {/* SignIn Form Section */}
      <div className="form-container">
        <h2>Sign In</h2>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="signin-button">Sign In</button>
        </form>
        <div className="button-container">
          <button
            className="forgot-password-button"
            onClick={() => navigate('/frgtpswd')}
          >
            Forgot Password?
          </button>
          <button
            className="signup-button"
            onClick={() => navigate('/SignUp')}
          >
            Create an Account
          </button>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="footer">
        <p>24/7 Service | Built with ❤️ by GEC Karwar</p>
        <p>© 2024 AI Job Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SignIn;
