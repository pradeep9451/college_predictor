import React, { useState } from 'react';
import "../pages/Login.css";
 import axios from "axios";
 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 

// ...
const handleSubmit = async (e) => {
  e.preventDefault();

  if (isLogin) {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true, // ✅ Send cookies!
        }
      );

      alert(res.data.message);

      // ✅ No need to store in localStorage
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  } else {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(res.data.message);
      setIsLogin(true);
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  }
};



  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
  };

  const styles = `
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .auth-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 450px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-title {
      font-size: 28px;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 8px 0;
      letter-spacing: -0.025em;
    }

    .auth-subtitle {
      font-size: 16px;
      color: #718096;
      margin: 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }

    .form-input {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s ease;
      background: #f7fafc;
      color: #2d3748;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-input::placeholder {
      color: #a0aec0;
    }

    .auth-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .auth-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }

    .auth-button:active {
      transform: translateY(0);
    }

    .auth-toggle {
      text-align: center;
      margin: 24px 0;
    }

    .auth-toggle p {
      color: #718096;
      margin: 0;
      font-size: 14px;
    }

    .toggle-button {
      background: none;
      border: none;
      color: #667eea;
      cursor: pointer;
      font-weight: 600;
      text-decoration: underline;
      font-size: 14px;
      padding: 0;
    }

    .toggle-button:hover {
      color: #5a67d8;
    }

    .auth-divider {
      position: relative;
      text-align: center;
      margin: 24px 0;
    }

    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e2e8f0;
    }

    .auth-divider span {
      background: white;
      color: #a0aec0;
      padding: 0 16px;
      font-size: 14px;
    }

    .social-auth {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .social-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      background: white;
      color: #2d3748;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .social-button:hover {
      border-color: #cbd5e0;
      background: #f7fafc;
      transform: translateY(-1px);
    }

    .social-icon {
      width: 20px;
      height: 20px;
      flex-shrink: 0;
    }

    .social-button.google:hover {
      border-color: #4285f4;
      color: #4285f4;
    }

    .social-button.github:hover {
      border-color: #333;
      color: #333;
    }

    @media (max-width: 480px) {
      .auth-container {
        padding: 16px;
      }
      
      .auth-card {
        padding: 24px;
      }
      
      .auth-title {
        font-size: 24px;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to your account' 
                : 'Sign up to get started'
              }
            </p>
          </div>

          <div className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter your full name"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required={!isLogin}
                />
              </div>
            )}

            <button onClick={handleSubmit} className="auth-button">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <div className="auth-toggle">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="toggle-button" 
                onClick={toggleMode}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="social-auth">
           
               <button
  className="social-button google"
  onClick={() => window.open("http://localhost:8000/api/auth/google", "_self")}
>
              <svg className="social-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            
            <button className="social-button github">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;