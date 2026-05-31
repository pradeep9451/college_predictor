import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CollegeList.css";

function CollegeList() {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  
  const navigate = useNavigate();

  // Fetch colleges from MongoDB API
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/api/colleges")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setColleges(data);
        setFilteredColleges(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching colleges:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter and search functionality
  useEffect(() => {
    let filtered = colleges;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (college.branches && college.branches.some(branch => 
          branch.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(college =>
        college.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Sort functionality
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "location":
          return a.location.localeCompare(b.location);
        case "established":
          return (b.established || 0) - (a.established || 0);
        case "distance":
          return (a.distanceFromRailway?.distanceKm || 999) - (b.distanceFromRailway?.distanceKm || 999);
        default:
          return 0;
      }
    });

    setFilteredColleges(filtered);
  }, [colleges, searchTerm, selectedLocation, sortBy]);

  // Get unique locations
  const uniqueLocations = [...new Set(colleges.map(college => college.location))].sort();

  // Handle college card click - Navigate to college detail page
  const handleCollegeClick = (collegeId) => {
    navigate(`/college/${collegeId}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSortBy("name");
  };

  if (loading) {
    return (
      <div className="college-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Colleges...</h3>
          <p>Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="college-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Colleges</h3>
          <p>Error: {error}</p>
          <button 
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="college-list">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-container">
          <h1 className="main-title">Maharashtra Engineering Colleges</h1>
          <p className="main-subtitle">
            Explore top engineering institutions across Maharashtra
          </p>
          
          {/* Stats Overview */}
          <div className="stats-overview">
            <div className="stat-card">
              <span className="stat-number">{colleges.length}</span>
              <span className="stat-label">Total Colleges</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{filteredColleges.length}</span>
              <span className="stat-label">Showing</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{uniqueLocations.length}</span>
              <span className="stat-label">Cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-container">
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-wrapper">
              <input
                type="text"
                placeholder="Search colleges by name, location, or branch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <div className="search-icon">🔍</div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-group">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
                <option value="established">Sort by Year</option>
                <option value="distance">Sort by Distance</option>
              </select>
            </div>

            <div className="view-options">
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  📊 Grid
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  📋 List
                </button>
              </div>

              {(searchTerm || selectedLocation) && (
                <button
                  className="clear-filters-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <div className="results-container">
          {filteredColleges.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No colleges found</h3>
              <p>Try adjusting your search criteria or clear the filters</p>
              <button
                className="clear-filters-btn"
                onClick={clearFilters}
              >
                Show All Colleges
              </button>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="results-header">
                <h2>
                  {filteredColleges.length === colleges.length 
                    ? `All Colleges (${colleges.length})` 
                    : `Found ${filteredColleges.length} of ${colleges.length} colleges`
                  }
                </h2>
                {(searchTerm || selectedLocation) && (
                  <div className="active-filters">
                    {searchTerm && (
                      <span className="filter-tag">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="filter-tag">
                        Location: {selectedLocation}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Colleges Grid/List */}
              <div className={`colleges-container ${viewMode}`}>
                {filteredColleges.map((college) => (
                  <div
                    key={college._id}
                    className="college-card"
                    onClick={() => handleCollegeClick(college._id)}
                  >
                    {/* College Header */}
                    <div className="college-header">
                      <h3 className="college-name">{college.name}</h3>
                      <div className="college-location">
                        <span className="location-icon">📍</span>
                        <span>{college.location}</span>
                      </div>
                    </div>

                    {/* College Info */}
                    <div className="college-info">
                      {college.established && (
                        <div className="info-item">
                          <span className="info-label">Established:</span>
                          <span className="info-value">{college.established}</span>
                        </div>
                      )}
                      
                      {college.branches && (
                        <div className="info-item">
                          <span className="info-label">Programs:</span>
                          <span className="info-value">{college.branches.length} Branches</span>
                        </div>
                      )}

                      {college.distanceFromRailway && (
                        <div className="info-item">
                          <span className="info-label">Nearest Station:</span>
                          <span className="info-value">
                            {college.distanceFromRailway.stationName} ({college.distanceFromRailway.distanceKm} km)
                          </span>
                        </div>
                      )}

                      {college.googleReviews && college.googleReviews.length > 0 && (
                        <div className="info-item">
                          <span className="info-label">Reviews:</span>
                          <span className="info-value">{college.googleReviews.length} Google Reviews</span>
                        </div>
                      )}
                    </div>

                    {/* College Footer */}
                    <div className="college-footer">
                      <div className="college-tags">
                        {college.type && (
                          <span className={`college-tag ${college.type.toLowerCase()}`}>
                            {college.type}
                          </span>
                        )}
                        {college.accreditation && (
                          <span className="college-tag accredited">
                            {college.accreditation}
                          </span>
                        )}
                      </div>
                      
                      <div className="view-details">
                        <span className="view-text">View Details</span>
                        <span className="arrow">→</span>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="card-overlay"></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Section */}
      <div className="footer-section1">
        <div className="footer-container1">
          <p>
            Showing {filteredColleges.length} of {colleges.length} engineering colleges in Maharashtra
          </p>
          <p className="last-updated">
            Data updated regularly • Click on any college to view detailed information
          </p>
        </div>
      </div>
    </div>
  );
}

export default CollegeList;