import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    colleges: 0,
    students: 0,
    accuracy: 0
  });

  const testimonials = [
    {
      name: "Pradeep Yadav ",
      role: "Acpce Student",
      content: "College Predictor's accurate cutoff predictions helped me secure admission to my dream engineering college!",
      image: "👩‍🎓",
      rating: 5
    },
    {
      name: "Adesh Waghe",
      role: "Acpce Student",
      content: "The detailed analysis and personalized recommendations made my NEET preparation strategy much more effective.",
      image: "👨‍⚕️",
      rating: 5
    },
    {
      name: "Shubham Khandale",
      role: "Acpce Student",
      content: "Thanks to this platform, I could make informed decisions about my college applications and got into my preferred course.",
      image: "👩‍💼",
      rating: 5
    }
  ];

  const features = [
    {
      icon: "🎯",
      title: "AI-Powered Predictions",
      description: "Get highly accurate cutoff predictions using advanced machine learning algorithms trained on years of admission data."
    },
    {
      icon: "📊",
      title: "Comprehensive Analytics",
      description: "Detailed trends, statistical analysis, and visual charts to help you understand admission patterns and competition levels."
    },
    {
      icon: "🏛️",
      title: "Extensive College Database",
      description: "Access information about 2500+ colleges including fees, placements, rankings, and course details across India."
    },
    {
      icon: "🎓",
      title: "Personalized Guidance",
      description: "Receive customized college recommendations based on your scores, preferences, location, and career goals."
    }
  ];

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate statistics on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateStats();
      }
    });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  const animateStats = () => {
    const targets = { colleges: 500, students: 70, accuracy: 86 };
    const duration = 2000;
    let startTime = Date.now();

    const updateStats = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setAnimatedStats({
        colleges: Math.floor(targets.colleges * progress),
        students: Math.floor(targets.students * progress),
        accuracy: Math.floor(targets.accuracy * progress)
      });

      if (progress < 1) {
        requestAnimationFrame(updateStats);
      }
    };

    requestAnimationFrame(updateStats);
  };

  return (
    <div className="home-container1">
      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Predict Your
              <span className="gradient-text"> Dream College</span>
              <br />Admission Success
            </h1>
            <p className="hero-description">
              Unlock your potential with AI-powered cutoff predictions, comprehensive college insights, 
              and personalized guidance. Make informed decisions for your academic future with 96% accuracy.
            </p>
            <div className="hero-buttons">
  <Link to="/predict">
    <button className="primary-button">
      Start Prediction
      <span className="button-arrow">→</span>
    </button>
  </Link>

  <Link to="/college-list">
    <button className="secondary-button">
      Explore Colleges
    </button>
  </Link>
</div>

          </div>
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="float-card card-1">📊 Analytics</div>
              <div className="float-card card-2">🎯 Predictions</div>
              <div className="float-card card-3">🏆 Rankings</div>
              <div className="float-card card-4">📈 College Predictor</div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" id="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{animatedStats.colleges.toLocaleString()}+</div>
            <div className="stat-label">Colleges Listed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{animatedStats.students.toLocaleString()}+</div>
            <div className="stat-label">Students Helped</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{animatedStats.accuracy}%</div>
            <div className="stat-label">Prediction Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Why Choose CollegePredictor?</h2>
          <p className="section-subtitle">
            Our advanced platform combines cutting-edge AI with comprehensive data analysis 
            to provide you with the most accurate predictions and insights.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">
            Join thousands of students who achieved their college dreams with our platform
          </p>
        </div>
        <div className="testimonial-carousel">
          <div className="testimonial-track" style={{transform: `translateX(-${currentSlide * 100}%)`}}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <div className="stars">
                    {Array.from({length: testimonial.rating}).map((_, i) => (
                      <span key={i} className="star">⭐</span>
                    ))}
                  </div>
                  <p className="testimonial-text">"{testimonial.content}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.image}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Predict Your College Success?</h2>
          <p className="cta-description">
            Join over 75,000 students who have successfully used our platform to secure 
            admissions in their dream colleges. Start your journey today!
          </p>
          <div className="cta-buttons">
            <button className="primary-button large">
              Get Started Free
              <span className="button-arrow">→</span>
            </button>
            <button className="secondary-button large">
              View Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;