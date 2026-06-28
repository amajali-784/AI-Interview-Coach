import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Body from './components/Body';
import SignUp from './components/SignUp';
import SignIn from './components/ss/SignIn';
import ProfileSetup from './components/ProfileSetup';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import HelpRedirect from './components/HelpRedirect';
import ChatWidget from './components/ChatWidget'; // Assuming ChatWidget is globally used
import ProfileEdit from './components/profile-edit';
import AdminLogin from './components/admin/adminlog';
import AdminDashboard from './components/admin/adminDashboard';
import ControPanel from './components/admin/control_panel';
import AdminCoursePage from './components/admin/AdminCoursePage';
import UserCoursePage from './components/UserCoursePage';
import AIInterviewPage from './components/interview/AIInterviewPage';
import AdminJobApp from './components/admin/AdminJobApp';
import JobsPage from './components/jobs';
import ManageApplication from './components/ManageApplication';
import FeedbackPage from './components/feedback';
import AdminFeedbackPage from './components/admin/AdminFeedback';
import RulePage from './components/interview/RulePage';
import LivePage from './components/interview/livepage';
import AIFeedbackPage from './components/interview/FeedbackPage';
import ManageApplications from './components/ManageApplications';
import ForgotPassword from './components/ForgotPassword';
const App = () => {
  const location = useLocation();

  // Exclude ChatWidget and Layout for specific pages
  const excludedPages = ['/help', '/adminlog','/adminDashboard','/control_panel','/admin-courses','/ai-interview','/admin-jobs','/admin-feedback','/rulepage','/livepage']; // Add '/adminlog' here
  const isExcludedPage = excludedPages.includes(location.pathname);

  return (
    <>
      {!isExcludedPage && <ChatWidget />} {/* Render ChatWidget on all pages except excluded ones */}
      {!isExcludedPage ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Body />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/ProfileSetup" element={<ProfileSetup />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/profile-edit" element={<ProfileEdit />} />
            <Route path="/usercourse" element={<UserCoursePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/manage_application" element={<ManageApplication />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path='/aifeedback' element={<AIFeedbackPage />} />
            <Route path='/progress' element={<ManageApplications/>} />
            <Route path='/frgtpswd'  element={<ForgotPassword/>} />
           </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/adminlog" element={<AdminLogin />} />
          <Route path="/help" element={<HelpRedirect />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/control_panel" element={<ControPanel />} />
          <Route path="/admin-courses" element={<AdminCoursePage />} />
          <Route path='/ai-interview' element={<AIInterviewPage />} />
          <Route path="/admin-jobs" element={<AdminJobApp />} />
          <Route path="/admin-feedback" element={<AdminFeedbackPage />} />
          <Route path="/rulepage" element={<RulePage />} />
          <Route path="/livepage" element={<LivePage />} />
        </Routes>
      )}
    </>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
