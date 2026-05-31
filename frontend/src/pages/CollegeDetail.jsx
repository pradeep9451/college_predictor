import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CollegeDetail.css";

const CollegeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageError, setImageError] = useState(false);

  //reviews
const [user, setUser] = useState(null);
const [reviewAuthor, setReviewAuthor] = useState("");
const [reviewRating, setReviewRating] = useState(0);
const [reviewText, setReviewText] = useState("");

useEffect(() => {
  fetch("http://localhost:8000/api/auth/me", { credentials: "include" })
    .then(res => {
      if (!res.ok) throw new Error("Not logged in");
      return res.json();
    })
    .then(data => {
      setUser(data.user);             // store full profile
      setReviewAuthor(data.user.name); // auto-fill reviewAuthor
    })
    .catch(() => setUser(null));
}, []);



const handleAddReview = async (e) => {
  e.preventDefault();
  if (!reviewAuthor || !reviewRating || !reviewText) return;

  try {
    const res = await fetch(`http://localhost:8000/api/colleges/${college._id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: reviewAuthor,
        rating: reviewRating,
        text: reviewText,
      }),
    });

    if (res.ok) {
      const updatedCollege = await res.json(); // backend returns the updated college
      setCollege(updatedCollege); // update state with new reviews
      setReviewAuthor("");
      setReviewRating("");
      setReviewText("");
    } else {
      alert("Failed to submit review");
    }
  } catch (err) {
    console.error(err);
    alert("Error submitting review");
  }
};

 
//reviews end


  useEffect(() => {
    const fetchCollege = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:8000/api/colleges/${id}`);
        setCollege(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching college details", err);
        setError(err.response?.data?.message || "Failed to load college details");
      } finally {
        setLoading(false);
      }
    };
    fetchCollege();
  }, [id]);

  const handleBackClick = () => {
    navigate('/college-list');
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">★</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="college-detail">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading College Details...</h3>
          <p>Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="college-detail">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>College Not Found</h3>
          <p>{error}</p>
          <button className="back-btn primary" onClick={handleBackClick}>
            Back to College List
          </button>
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="college-detail">
        <div className="error-container">
          <h3>College Not Found</h3>
          <p>The requested college could not be found.</p>
          <button className="back-btn primary" onClick={handleBackClick}>
            Back to College List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="college-detail">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <button className="back-btn" onClick={handleBackClick}>
            ← Back to Colleges
          </button>
          
          <div className="college-hero-info">
            <div className="college-image-container">
              {!imageError && college.image ? (
                <img 
                  src={college.image} 
                  alt={college.name}
                  className="college-hero-image"
                  onError={handleImageError}
                />
              ) : (
                <div className="college-placeholder-image">
                  🏛️
                </div>
              )}
            </div>
            
            <div className="college-title-section">
              <h1 className="college-title">{college.name}</h1>
              <div className="college-subtitle">
                <div className="location-info">
                  <span className="location-icon">📍</span>
                  <span>{college.location}</span>
                </div>
                {college.establishedYear && (
                  <div className="established-info">
                    <span className="calendar-icon">📅</span>
                    <span>Est. {college.establishedYear}</span>
                  </div>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="quick-stats">
                {college.type && (
                  <div className="stat-badge">
                    <span className="stat-value">{college.type}</span>
                    <span className="stat-label">Type</span>
                  </div>
                )}
                {college.ranking && (
                  <div className="stat-badge">
                    <span className="stat-value">#{college.ranking}</span>
                    <span className="stat-label">Ranking</span>
                  </div>
                )}
                {college.courses && (
                  <div className="stat-badge">
                    <span className="stat-value">{college.courses.length}</span>
                    <span className="stat-label">Courses</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <div className="tabs-wrapper">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
            onClick={() => setActiveTab('fees')}
          >
            Fees & Cutoffs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            Location & Reviews
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="content-container">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="content-grid">
              <div className="info-card1">
                <h3>College Information</h3>
                <div className="info-list1">
                  <div className="info-item1">
                    <span className="info-label1">Full Name:</span>
                    <span className="info-value1">{college.name}</span>
                  </div>
                  <div className="info-item1">
                    <span className="info-label1">Location:</span>
                    <span className="info-value1">{college.location}</span>
                  </div>
                  {college.type && (
                    <div className="info-item1">
                      <span className="info-label1">Type:</span>
                      <span className="info-value1">{college.type}</span>
                    </div>
                  )}
                  {college.establishedYear && (
                    <div className="info-item1">
                      <span className="info-label1">Established:</span>
                      <span className="info-value1">{college.establishedYear}</span>
                    </div>
                  )}
                  {college.ranking && (
                    <div className="info-item1">
                      <span className="info-label1">Ranking:</span>
                      <span className="info-value1">#{college.ranking}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="info-card1">
                <h3>Transportation</h3>
                <div className="info-list1">
                  {college.nearestRailwayStation && (
                    <div className="info-item1">
                      <span className="info-label">Nearest Railway Station:</span>
                      <span className="info-value1">{college.nearestRailwayStation}</span>
                    </div>
                  )}
                  {college.distanceFromRailway && (
                    <div className="info-item1">
                      <span className="info-label1">Distance from Station:</span>
                      <span className="info-value1">{college.distanceFromRailway.distanceKm} km</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Available Courses & Branches</h2>
              <p>Comprehensive list of engineering programs offered</p>
            </div>
            
            {college.courses && college.courses.length > 0 ? (
              <div className="courses-grid">
                {college.courses.map((course, index) => (
                  <div key={index} className="course-card">
                    <div className="course-header">
                      <h4 className="course-name">{course.name}</h4>
                      <span className="course-duration">{course.duration} years</span>
                    </div>
                    <div className="course-details">
                      {course.degree && (
                        <p className="course-degree">Degree: {course.degree}</p>
                      )}
                      {course.seats && (
                        <p className="course-seats">Total Seats: {course.seats}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : college.branches ? (
              <div className="courses-grid">
                {college.branches.map((branch, index) => (
                  <div key={index} className="course-card">
                    <div className="course-header">
                      <h4 className="course-name">{branch}</h4>
                      <span className="course-duration">4 years</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>Course information not available</p>
              </div>
            )}
          </div>
        )}

       {activeTab === 'fees' && (
  <div className="tab-content">
    <div className="section-header">
      <h2>Fee Structure</h2>
      <p>MHT-CET based admission details</p>
    </div>

    {college.fees ? (
      <div className="fees-container">
        <div className="fee-card">
          <div className="fee-grid">
            <div className="fee-item general">
              <span className="category">General</span>
              <span className="amount">₹{college.fees.general?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="fee-item obc">
              <span className="category">OBC</span>
              <span className="amount">₹{college.fees.obc?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="fee-item sc">
              <span className="category">SC</span>
              <span className="amount">₹{college.fees.sc?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="fee-item st">
              <span className="category">ST</span>
              <span className="amount">₹{college.fees.st?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="fee-item ews">
              <span className="category">EWS</span>
              <span className="amount">₹{college.fees.ews?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="no-data">
        <h3>Fee Information Not Available</h3>
        <p>Please contact the college directly for current fee structure.</p>
      </div>
    )}
  </div>
)}


        {/* Location & Reviews Tab */}
        {activeTab === 'location' && (
          <div className="tab-content">
            <div className="section-header">
              <h2>Location & Reviews</h2>
              <p>Find us on the map and read what students say</p>
            </div>

            <div className="location-reviews-container">
              {/* Google Map */}
              <div className="map-container1">
                <h3>Campus Location</h3>
                <div className="map-wrapper">
                  <iframe
                    src={`https://www.google.com/maps?q=${encodeURIComponent(college.location + ' ' + college.name)}&output=embed`}
                    width="100%"
                    height="400"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`${college.name} Location`}
                  />
                </div>
                <div className="map-info">
                  <p><strong>Address:</strong> {college.location}</p>
                  {college.nearestRailwayStation && (
                    <p><strong>Nearest Station:</strong> {college.nearestRailwayStation}</p>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="reviews-container1">
  <h3>Student Reviews</h3>

  {/* Review Submission Form */}
 <form onSubmit={handleAddReview} className="add-review-form">
  <input
    type="text"
    value={reviewAuthor}
    readOnly
  />
  <div className="star-input">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= reviewRating ? "star filled" : "star"}
        onClick={() => setReviewRating(star)}
      >
        ★
      </span>
    ))}
  </div>
  <textarea
    placeholder="Write your review"
    value={reviewText}
    onChange={(e) => setReviewText(e.target.value)}
    required
  />
  <button type="submit">Submit Review</button>
</form>


{/* Existing Reviews List */}
{college.reviews && college.reviews.length > 0 ? (
  <div className="reviews-list">
    {[...college.reviews].reverse().map((review, index) => (
      <div key={index} className="review-card">
        <div className="review-header">
          <div className="reviewer-info">
            <span className="reviewer-name1">
              {review.author || `Student ${index + 1}`}
            </span>
            {review.rating && (
              <div className="rating">
                {renderStarRating(review.rating)}
                <span className="rating-number">({review.rating})</span>
              </div>
            )}
          </div>
        </div>
        <div className="review-content">
          <p className="review-text">
            {typeof review === 'string' ? review : review.text}
          </p>
        </div>
      </div>
    ))}
  </div>
) : (
  <div className="no-reviews">
    <div className="no-reviews-icon">💬</div>
    <h4>No Reviews Yet</h4>
    <p>Be the first to share your experience about this college!</p>
  </div>
)}

</div>

              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeDetail;