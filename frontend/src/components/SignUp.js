import React, { useState } from 'react';
import './SignUp.css';
import successImage from './image.png'; // Assuming you have a success image
import logo from './logo.png'; // Assuming you have a logo

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, password, confirmPassword } = formData;

    const nameRegex = /^[a-zA-Z\s]+$/; // Only alphabets and spaces
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Gmail email only
    const phoneRegex = /^[0-9]{10}$/; // Exactly 10 digits
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // At least one lowercase, one uppercase, one number, one special char, min 8 chars

    if (!nameRegex.test(name)) {
      setMessage('Name should only contain alphabets and spaces.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setMessage('Email must be a valid Gmail address.');
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setMessage('Phone number must be exactly 10 digits.');
      return false;
    }
    if (!passwordRegex.test(password)) {
      setMessage(
        'Password must have at least 8 characters, including uppercase, lowercase, a number, and a special character.'
      );
      return false;
    }
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return false;
    }

    setMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Sign up successful!');
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

        setTimeout(() => {
          window.location.href = '/signin';
        }, 5000);
      } else {
        setMessage(data.message || 'Something went wrong.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error in submitting form: ', error);
      setMessage('Error connecting to server.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="signup-container">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h1>AI-Powered Job Interview Coach</h1>
      </header>

      <div className="form-container">
        <h2>Sign Up</h2>
        {message && !isSuccess && <p className="message">{message}</p>}

        {isSuccess && (
          <div className="success-message">
            <img src={successImage} alt="Success" className="success-image" />
            <h3>Signup Successful!</h3>
            <p>You will be redirected shortly...</p>
          </div>
        )}

        {!isSuccess && (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" className="signup-button">Sign Up</button>
          </form>
        )}
      </div>

      <footer className="footer">
        <p>24/7 Service | Built with ❤️ by GEC Karwar</p>
        <p>© 2024 AI Job Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default SignUp;
