import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RulePage.css';

const RulePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [inputValue, setInputValue] = useState('');

  // Fetch user profile and check login status
  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/signin'); // Redirect if not logged in
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
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

  // Enforce window maximization and fullscreen, and prevent resizing or minimize
  useEffect(() => {
    const enterFullScreen = () => {
      const docElm = document.documentElement;
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) { // Firefox
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) { // Chrome and Safari
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) { // IE/Edge
        docElm.msRequestFullscreen();
      }
    };

    // Trigger fullscreen and prevent resizing or minimizing
    const handleWindowChange = () => {
      if (
        window.outerWidth < window.screen.width - 100 || // Check if resized
        window.outerHeight < window.screen.height - 100 || // Check if minimized
        document.hidden // Check if tab is hidden
      ) {
        alert('You cannot resize, minimize, or switch tabs during the interview!');
        navigate('/dashboard'); // Redirect to dashboard
      }
    };

    // Maximize and lock the window into fullscreen on page load
    enterFullScreen();

    // Disable browser back/forward navigation
    const handlePopState = () => {
      alert('Navigation is restricted during the interview!');
      navigate('/dashboard');
    };

    // Event listeners
    window.addEventListener('resize', handleWindowChange);
    document.addEventListener('visibilitychange', handleWindowChange);
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleWindowChange);
      document.removeEventListener('visibilitychange', handleWindowChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Disable right-click and developer tools
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableDevTools = (e) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J'))) {
        e.preventDefault();
        alert('Developer tools are disabled!');
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableDevTools);

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableDevTools);
    };
  }, []);

  // Handle start interview
  const handleStartInterview = () => {
    if (inputValue.trim().toLowerCase() === 'start') {
      alert('Starting the interview...');
      navigate('/livepage'); // Proceed to interview page
    } else {
      alert('Please type "start" to proceed.');
    }
  };

  // Handle user logout


  return (
    <div className="rule-page">
      <div className="container">
        {user ? (
          <>
            <h1 className="greeting">Welcome, {user.name}!</h1>
            <p className="instructions">Follow these rules carefully before starting the interview:</p>
            <ol className="rules-list">
              <li>Ensure stable internet connectivity.</li>
              <li>Maximize your browser window.</li>
              <li>Do not resize, minimize, or switch tabs during the interview.</li>
              <li>Have your resume and ID ready for verification.</li>
              <li>Stay in a quiet, well-lit environment.</li>
              <li>Dress professionally as per industry standards.</li>
              <li>Be punctual and start the interview on time.</li>
              <li>Keep your webcam and microphone enabled throughout.</li>
              <li>Maintain good posture and eye contact with the camera.</li>
              <li>Answer all questions clearly and concisely.</li>
              <li>Do not use external help or notes during the interview.</li>
              <li>Avoid interruptions or background noise.</li>
              <li>Respect time limits for each question.</li>
              <li>Be honest and authentic in your responses.</li>
              <li>Provide detailed explanations for your answers.</li>
              <li>Have a pen and paper ready for problem-solving tasks.</li>
              <li>Ask questions when given the opportunity.</li>
              <li>Complete all tasks and assignments during the session.</li>
              <li>Stay focused and attentive throughout.</li>
              <li>Click "Start" only when fully prepared.</li>
            </ol>
            <div className="input-section">
              <label className="input-label">
                Type "start" to begin:
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type 'start' to proceed"
                  className="input-field"
                />
              </label>
              <button onClick={handleStartInterview} className="start-button">
                Submit
              </button>
            </div>
          </>
        ) : (
          <p>Loading user information...</p>
        )}
      </div>
    </div>
  );
};

export default RulePage;
