import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1 className="about-title">About College Predictor</h1>
        <p className="about-subtitle">
          Empowering students with data-driven college admission insights
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="section-icon">🎯</div>
          <h2>Our Mission</h2>
          <p>
            College Predictor leverages advanced machine learning algorithms to provide 
            accurate college admission predictions. We help students make informed decisions 
            about their academic future by analyzing historical data and admission trends.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">🤖</div>
          <h2>How It Works</h2>
          <p>
            Our platform uses sophisticated ML models trained on comprehensive admission data, 
            cutoff trends, and academic parameters. The system analyzes and 
            provides personalized predictions for different colleges.
          </p>
        </section>

        <section className="about-section">
          <div className="section-icon">📊</div>
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Accurate Predictions</h3>
              <p>ML-powered predictions based on comprehensive data analysis</p>
            </div>
            <div className="feature-item">
              <h3>Real-time Updates</h3>
              <p>Stay updated with the latest cutoff trends and admission patterns</p>
            </div>
            <div className="feature-item">
              <h3>Personalized Results</h3>
              <p>Get customized predictions based on your academic profile</p>
            </div>
            <div className="feature-item">
              <h3>Multiple Categories</h3>
              <p>Support for various reservation categories and quota systems</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="section-icon">🔬</div>
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <span className="tech-item">Machine Learning</span>
            <span className="tech-item">Python</span>
            <span className="tech-item">React</span>
            <span className="tech-item">Node.js</span>
            {/* <span className="tech-item">Data Analytics</span> */}
          </div>
        </section>

        <section className="about-section">
          <div className="section-icon">📈</div>
          <h2>Data & Accuracy</h2>
          <p>
            Our predictions are based on extensive datasets including previous years' cutoffs, 
            seat availability, application trends, and admission statistics. We continuously 
            update our models to maintain high accuracy and relevance.
          </p>
        </section>

        <div className="contact-section">
          <h2>Get In Touch</h2>
          <p>
            Have questions or suggestions? We're here to help students navigate 
            their academic journey successfully.
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span>📧 contact@collegepredictor.com</span>
            </div>
            <div className="contact-item">
              <span>🌐 www.collegepredictor.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;