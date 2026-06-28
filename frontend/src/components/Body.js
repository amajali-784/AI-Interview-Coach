import React from "react";
import { useNavigate } from "react-router-dom";
import "./Body.css"; // Ensure styles match this updated layout

const Body = () => {
  const navigate = useNavigate();

  return (
    <div className="app">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <img src="/logo.png" alt="Logo" className="header-icon" />
          <h1 className="header-title">
            AI-Powered Job Interview Coach
          </h1>
        </div>
      </header>

      {/* Main Body Section */}
      <main className="body">
        <section className="hero-section">
          <h1 className="hero-title">
            Ace Your Job Interviews with AI-Driven Insights
          </h1>
          <p className="hero-subtitle">
            Personalized feedback. Real-time practice. All in one platform.
          </p>
          <div className="hero-buttons">
            <button
              onClick={() => navigate("/SignUp")}
              className="btn primary-btn"
            >
              Sign Up
            </button>
            <button
              onClick={() => navigate("/SignIn")}
              className="btn secondary-btn"
            >
              Sign In
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <img
                src="./ii.jpg"
                alt="AI Analysis"
                className="feature-icon"
              />
              <h3>AI-Powered Analysis</h3>
              <p>
                <b>Leverage advanced AI to analyze your responses, tone, and body language.</b>
              </p>
            </div>
            <div className="feature-item">
              <img
                src="./image1.jpg"
                alt="Interview Simulation"
                className="feature-icon"
              />
              <h3>Interview Simulation</h3>
              <p>
                <b> Practice mock interviews in a realistic virtual environment.</b>
              </p>
            </div>
            <div className="feature-item">
              <img
                src="./image2.jpg"
                alt="Progress Tracking"
                className="feature-icon"
              />
              <h3>Track Your Progress</h3>
              <p>
                <b>Get detailed reports and actionable feedback after each session.</b>
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section">
          <div className="about-content">
            <h2>About the AI Job Coach</h2>
            <p>
             <b> Our platform blends cutting-edge technologies like Natural
              Language Processing, computer vision, and sentiment analysis to
              provide a comprehensive solution for interview preparation.</b>
            </p>
            <p>
              <b>From real-time feedback on facial expressions to resume insights
              and confidence-boosting simulations, we ensure you're fully
              prepared for success.</b>
            </p>
          </div>
          <img
            
            alt="AI Job Coach Overview"
            className="about-image"
          />
        </section>
        
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          <div className="tech-stack">
            <img src="/react.png" alt="React" className="tech-icon" />
            <img src="/node.png" alt="Node.js" className="tech-icon" />
            <img src="/python.png" alt="Python" className="tech-icon" />
            <p>Powered by React, Node.js, and Python</p>
          </div>
          <div className="footer-info">
            <p>24/7 Service | Built with ❤️ by GEC Karwar</p>
            <p>© 2024 AI Job Coach. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Body;
