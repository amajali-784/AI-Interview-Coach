import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './adminlog.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Assuming a dummy login API with static admin credentials
     await axios.post('http://localhost:5000/api/auth/login', { username, password });

      
      // Store the login flag in localStorage
      localStorage.setItem('isLoggedIn', 'true'); 
      navigate('/adminDashboard'); // Redirect to dashboard
    } catch (error) {
      alert('Invalid credentials or server error.');
    }
  };

  return (
    <div className="adm-container">
      <header className="adm-header">
        <div className="adm-header-content">
          <img src="./logo.png" alt="Logo" className="adm-logo" />
          <h1>AI-Powered Job Interview Coach Admin Login</h1>
        </div>
      </header>

      <div className="adm-login-form">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="adm-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="adm-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="adm-btn">Login</button>
        </form>
      </div>

      <footer className="adm-footer">
        <p>24/7 Service | Built with ❤️ by GEC Karwar</p>
        <p>© 2024 AI Job Coach. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLogin;
