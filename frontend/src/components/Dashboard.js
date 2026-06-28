import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // User profile state
  const [menuOpen, setMenuOpen] = useState(false); // Menu open state
  const [theme, setTheme] = useState('light'); // Theme state

  // Fetching user profile when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/signin');
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data); // Store user profile in state
        } else {
          console.error('Failed to fetch profile');
          navigate('/signin');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/signin');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Handle logout action
  const handleLogout = () => {
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/signin');
  };

  // Toggle the sidebar menu open/close
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Toggle theme between light and dark
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <div className={`dashboard-wrapper ${theme}`}>
      {/* Header */}
      <header className="header-wrapper">
        <div className="header-logo" onClick={toggleMenu}>
          <span className="menu-toggle">&#9776;</span><img src="/logo.png" alt="Logo" className="header-icon" /> AI Job Interview Coach
        </div>
        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          {user ? (
            <div className="user-profile">
              <span className="user-name">Hi, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => navigate('/signin')} className="login-btn">
              Login
            </button>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar-container ${menuOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-navigation">
          <ul>
            <li>
              <Link to="/ai-interview">AI Interview</Link>
            </li>
            <li>
              <Link to="/progress">Progress</Link>
            </li>
            <li>
              <Link to="/usercourse">Courses</Link>
            </li>
            <li>
              <Link to="/jobs">Apply for Jobs</Link>
            </li>
            <li>
              <Link to="/manage_application">Manage Applications</Link>
            </li>
           
            <li>
              <Link to="/profile-edit">Profile Edit</Link>
            </li>
            <li>
              <Link to="/help">Help</Link>
            </li>
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content-wrapper">
        {user ? (
          <>
            <h1>Welcome, {user.name}!</h1>
            <div className="profile-summary">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Location:</strong> {user.profile?.location || 'Not Specified'}
              </p>
              <p>
                <strong>Experience:</strong> {user.profile?.experience || 'Not Specified'} years
              </p>
              <p>
                <strong>Skills:</strong> {user.profile?.skills || 'Not Specified'}
              </p>
            </div>
            <div className="platform-purpose-banneras">
          <h2>Empowering You for Success!</h2>
          <p>
            This platform is designed to help you develop real skills, improve your interview techniques, and achieve your career goals. 
            <strong> Cheating is strictly prohibited and goes against the principles of fair preparation and personal growth.</strong>
          </p>
        </div>
          </>
        ) : (
          <p>Loading your profile...</p>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-wrapper">
        <p>
          AI-Powered Job Interview Coach | 24/7 Support | Built with ❤️ by GEC Karwar
        </p>
        <p>&copy; {new Date().getFullYear()} All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
