import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/admin-dashboard">Dashboard</Link></li>
          <li><Link to="/admin-courses">Courses</Link></li>
          <li><Link to="/admin-jobs">Jobs</Link></li>
          <li><Link to="/admin-feedback">Feedback</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
