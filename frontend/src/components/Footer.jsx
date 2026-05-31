import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">CollegePredictor</span>
          </div>
          <p className="footer-description">
            Empowering students to make informed decisions about their educational future 
            through AI-powered predictions and comprehensive college insights. Join thousands 
            of students who have achieved their dreams with our platform.
          </p>
          <div className="social-links">
            <a href="#" className="social-link facebook" aria-label="Facebook">
              <span>📘</span>
            </a>
            <a href="#" className="social-link twitter" aria-label="Twitter">
              <span>🐦</span>
            </a>
            <a href="#" className="social-link instagram" aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="#" className="social-link linkedin" aria-label="LinkedIn">
              <span>💼</span>
            </a>
            <a href="#" className="social-link youtube" aria-label="YouTube">
              <span>📺</span>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/predict">Predict Cutoff</a></li>
            <li><a href="/colleges">College Database</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Services</h4>
          <ul className="footer-links">
            <li><a href="/jee-prediction">JEE Predictions</a></li>
            <li><a href="/neet-analysis">NEET Analysis</a></li>
            <li><a href="/mba-counseling">MBA Counseling</a></li>
            <li><a href="/career-guidance">Career Guidance</a></li>
            <li><a href="/admission-help">Admission Help</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Resources</h4>
          <ul className="footer-links">
            <li><a href="/blog">Blog</a></li>
            <li><a href="/guides">Study Guides</a></li>
            <li><a href="/exam-tips">Exam Tips</a></li>
            <li><a href="/college-reviews">College Reviews</a></li>
            <li><a href="/success-stories">Success Stories</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Support</h4>
          <ul className="footer-links">
            <li><a href="/help">Help Center</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/support">Live Support</a></li>
            <li><a href="/feedback">Feedback</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-title">Legal</h4>
          <ul className="footer-links">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/disclaimer">Disclaimer</a></li>
            <li><a href="/refund">Refund Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-newsletter">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h3>Stay Updated</h3>
            <p>Get the latest college updates, cutoff predictions, and admission news delivered to your inbox.</p>
          </div>
          <div className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="copyright">
            <p>&copy; 2025 CollegePredictor. All rights reserved.</p>
            <p>Made with ❤️ for students across India</p>
          </div>
          <div className="footer-badges">
            <div className="badge">
              <span className="badge-icon">🔒</span>
              <span className="badge-text">Secure Platform</span>
            </div>
            <div className="badge">
              <span className="badge-icon">✅</span>
              <span className="badge-text">Verified Data</span>
            </div>
            <div className="badge">
              <span className="badge-icon">🏆</span>
              <span className="badge-text">Trusted by 75+ Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;