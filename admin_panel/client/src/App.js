import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Courses from './components/Courses';
import Jobs from './components/Jobs';
import Sidebar from './components/Sidebar';
import './styles/AdminPanel.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-courses" element={<Courses />} />
        <Route path="/admin-jobs" element={<Jobs />} />
      </Routes>
    </Router>
  );
};

export default App;
