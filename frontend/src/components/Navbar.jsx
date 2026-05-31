import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const dropdownRef = useRef();
  const mobileMenuRef = useRef();
  const searchRef = useRef();

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  // Search for colleges
  const searchColleges = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/colleges/search?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.colleges || []);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      searchColleges(query);
    }, 300);
  };

  // Handle college selection
  const handleCollegeSelect = (college) => {
  setSearchQuery("");
  setShowSearchResults(false);
  navigate(`/college/${college._id}`);
};


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      
      // Only close mobile menu if clicking outside both the menu and hamburger button
      if (mobileMenuOpen && 
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(event.target) && 
          !event.target.closest('.hamburger-menu')) {
        setMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      // Close mobile menu when resizing to desktop
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">College Predictor</div>
      
      {/* College Search Bar */}
      <div className="search-container" ref={searchRef}>
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="college-search-input"
            onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
          />
          <div className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        
        {showSearchResults && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.slice(0, 5).map((college) => (
              <div
                key={college.id}
                className="search-result-item"
                onClick={() => handleCollegeSelect(college)}
              >
                <div className="college-name">{college.name}</div>
                <div className="college-location">{college.location}</div>
              </div>
            ))}
          </div>
        )}
        
        {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
          <div className="search-results">
            <div className="no-results">No colleges found</div>
          </div>
        )}
      </div>
      
      {/* Hamburger Menu Button */}
      <button 
        className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Desktop Navigation */}
      <div className="navbar-links desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/predict">Predict College</Link>
        <Link to="/college-list">College List</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact Us</Link>

        {user ? (
          <div className="profile-menu" ref={dropdownRef}>
            <div
              className="profile-avatar-letter"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {dropdownOpen && (
              <div className="dropdown-content">
                <div className="profile-name">{user.name}</div>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`mobile-nav ${mobileMenuOpen ? 'active' : ''}`}
        ref={mobileMenuRef}
      >
        {/* Mobile Search */}
        <div className="mobile-search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search colleges..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="college-search-input mobile"
              onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
            />
            <div className="search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
          
          {showSearchResults && searchResults.length > 0 && (
            <div className="search-results mobile">
              {searchResults.slice(0, 5).map((college) => (
                <div
                  key={college.id}
                  className="search-result-item"
                  onClick={() => { handleCollegeSelect(college); closeMobileMenu(); }}
                >
                  <div className="college-name">{college.name}</div>
                  <div className="college-location">{college.location}</div>
                </div>
              ))}
            </div>
          )}
          
          {showSearchResults && searchResults.length === 0 && searchQuery.trim().length >= 2 && (
            <div className="search-results mobile">
              <div className="no-results">No colleges found</div>
            </div>
          )}
        </div>
        
        <Link to="/" onClick={closeMobileMenu}>Home</Link>
        <Link to="/predict" onClick={closeMobileMenu}>Predict College</Link>
        <Link to="/college-list" onClick={closeMobileMenu}>College List</Link>
        <Link to="/about" onClick={closeMobileMenu}>About</Link>
        <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>


        {user ? (
          <div className="mobile-profile-section">
            <div className="mobile-profile-name">{user.name}</div>
            <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
            <button onClick={() => { handleLogout(); closeMobileMenu(); }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" onClick={closeMobileMenu}>Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;