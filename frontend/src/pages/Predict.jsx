import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./Predict.css";
// import CollegeTrendChart from "./CollegeTrendChart";





function Predict() {
  const [form, setForm] = useState({
    percentile: "",
    branch: "",
    category: "",
    city: "",
   
  });

  const [options, setOptions] = useState({ branches: [], categories: [], cities: [] });
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [collegeSearchTerm, setCollegeSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


// 👇 Fetch student's mhtcetScore on mount
useEffect(() => {
  axios.get("http://localhost:8000/api/auth/me", { withCredentials: true })
    .then(res => {
      if (res.data.user) {
        setForm(prev => ({
          ...prev,
          percentile: res.data.user.mhtcetScore || "",   // prefill percentile
          category: res.data.user.category || "",        // prefill category
          branch: res.data.user.branch || ""            // optional prefill branch
        }));
      }
    })
    .catch(err => console.error("Error fetching profile:", err));
}, []);

 // no studentId needed


  useEffect(() => {
    axios.get("http://127.0.0.1:5000/options")
      .then(res => {
        setOptions({
          branches: res.data.branches.map(b => ({ label: b, value: b })),
          categories: res.data.categories.map(c => ({ label: c, value: c })),
          cities: (res.data.cities || []).map(city => ({ label: city, value: city }))
        });
      })
      .catch((err) => {
        console.error("Error loading options:", err);
        setError("Failed to load dropdown options. Please refresh the page.");
      });
  }, []);

  const handleSelectChange = (opt, name) => {
    setForm(prev => ({ ...prev, [name]: opt ? opt.value : "" }));
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    // Only send the keys backend expects
    const payload = {
      percentile: parseFloat(form.percentile) || 0,
      branch: form.branch,
      category: form.category
    };

    const res = await axios.post("http://127.0.0.1:5000/predict", payload);
    setColleges(res.data.matches || []);
    setFilteredColleges(res.data.matches || []);
    setCitySearchTerm("");
    setCollegeSearchTerm("");
    setError("");
  } catch (err) {
    console.error(err.response?.data || err);
    setError(err.response?.data?.error || "Prediction failed. Please try again.");
    setColleges([]);
    setFilteredColleges([]);
  } finally {
    setLoading(false);
  }
};

  // Combined search filter for both college name and city
  const handleSearch = (collegeSearch, citySearch) => {
    let filtered = [...colleges];
    
    // Filter by college name
    if (collegeSearch.trim()) {
      filtered = filtered.filter(college => 
        college.college && college.college.toLowerCase().includes(collegeSearch.toLowerCase())
      );
    }
    
    // Filter by city
    if (citySearch.trim()) {
      filtered = filtered.filter(college => 
        college.city && college.city.toLowerCase().includes(citySearch.toLowerCase())
      );
    }
    
    setFilteredColleges(filtered);
  };

  // Handle college name search
  const handleCollegeSearch = (e) => {
    const searchTerm = e.target.value;
    setCollegeSearchTerm(searchTerm);
    handleSearch(searchTerm, citySearchTerm);
  };

  // // Handle city search
  // const handleCitySearch = (e) => {
  //   const searchTerm = e.target.value;
  //   setCitySearchTerm(searchTerm);
  //   handleSearch(collegeSearchTerm, searchTerm);
  // };

  // Custom styles for react-select to match the design
  const customSelectStyles = {
    control: (base) => ({
      ...base,
      minHeight: '45px',
      borderRadius: '8px',
      borderColor: '#e5e7eb',
      borderWidth: '2px',
      boxShadow: 'none',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#4a90e2'
      }
    }),
    menu: (base) => ({
      ...base,
      borderRadius: '8px',
      marginTop: '4px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4a90e2' : state.isFocused ? '#e3f2fd' : 'white',
      color: state.isSelected ? 'white' : '#1f2937',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      '&:active': {
        backgroundColor: '#4a90e2'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    })
  };

  return (
    <div className="predict-wrapper">
      <div className="predict-container">
        {/* Header Section */}
        <div className="header-section1">
          <div className="icon-wrapper1">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>
          <h1 className="main-title1">College Predictor</h1>
          <p className="subtitle1">Find the best colleges matching your profile</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="predict-form">
         <div className="form-group">
            <label htmlFor="percentile" className="form-label">
              Percentile Score
            </label>
         <input
  id="percentile"
  type="number"
  className="form-input"
  value={form.percentile}          // use percentile, not mhtcetScore
  onChange={(e) =>
    setForm({ ...form, percentile: e.target.value })  // same here
  }
  placeholder="Enter your percentile (0-100)"
  min="0"
  max="100"
  step="0.01"
  required
/>


          </div>

          <div className="form-group">
            <label htmlFor="branch" className="form-label">
              Branch / Discipline
            </label>
            <Select
  inputId="branch"
  options={options.branches}
  onChange={(opt) => handleSelectChange(opt, "branch")}
  placeholder="Select your branch"
  styles={customSelectStyles}
  isClearable
  value={options.branches.find(opt => opt.value === form.branch) || null}
/>
          </div>

         <div className="form-group">
  <label htmlFor="category" className="form-label">
    Category
  </label>
  <Select
    inputId="category"
    options={options.categories}
    onChange={(opt) => handleSelectChange(opt, "category")}
    placeholder="Select your category"
    styles={customSelectStyles}
    isClearable
    value={
      // Find the option object that matches the category in form
      options.categories.find(opt => opt.value === form.category) || null
    }
  />
</div>


          {/* <div className="form-group">
            <label htmlFor="city" className="form-label">
              City / Location
            </label>
            <Select
              inputId="city"
              options={options.cities}
              onChange={(opt) => handleSelectChange(opt, "city")}
              placeholder="Select preferred city"
              styles={customSelectStyles}
              isClearable
            />
          </div> */}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Find Colleges
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}

        {/* Results Section */}
        {colleges.length > 0 && (
          <div className="results-section">
            <div className="results-header">
              <h2 className="results-title">Top College Matches</h2>
              <span className="results-count">{filteredColleges.length} Results</span>
            </div>

            {/* Search Filters */}
            <div className="search-filters-container">
              {/* College Name Search */}
              <div className="filter-section">
                <label htmlFor="collegeSearch" className="filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                  </svg>
                  Search by College or City Name
                </label>
                <div className="search-input-wrapper">
                  <input
                    id="collegeSearch"
                    type="text"
                    className="search-input"
                    value={collegeSearchTerm}
                    onChange={handleCollegeSearch}
                    placeholder="Type college name..."
                  />
                  {collegeSearchTerm && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => {
                        setCollegeSearchTerm("");
                        handleSearch("", citySearchTerm);
                      }}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* City Search Filter */}
              {/* <div className="filter-section">
                <label htmlFor="citySearch" className="filter-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Search by City
                </label>
                <div className="search-input-wrapper">
                  <input
                    id="citySearch"
                    type="text"
                    className="search-input"
                    value={citySearchTerm}
                    onChange={handleCitySearch}
                    placeholder="Type city name..."
                  />
                  {citySearchTerm && (
                    <button 
                      className="clear-search-btn"
                      onClick={() => {
                        setCitySearchTerm("");
                        handleSearch(collegeSearchTerm, "");
                      }}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                  )}
                </div>
              </div> */}
            </div>

            {(collegeSearchTerm || citySearchTerm) && (
              <p className="search-results-info">
                Showing {filteredColleges.length} of {colleges.length} colleges
                {collegeSearchTerm && ` matching "${collegeSearchTerm}"`}
                {collegeSearchTerm && citySearchTerm && " in"}
                {citySearchTerm && ` "${citySearchTerm}"`}
              </p>
            )}

            {filteredColleges.length === 0 ? (
              <div className="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <p>No colleges found in the selected city</p>
              </div>
            ) : (
              <div className="colleges-list">
                {filteredColleges.map((c, i) => (
                  <div key={i} className="college-card">
                    <div className="college-rank">#{i + 1}</div>
                    <div className="college-details">
                      <h3 className="college-name">{c.college}</h3>
                      {c.city && <p className="college-city">{c.city}</p>}
                      <div className="college-info">
                        <span className="cutoff-badge">
                          Cutoff: {c.predicted_cutoff}%
                        </span>
                        <span className={`status-badge status-${c.status?.toLowerCase()}`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {/* <div>
      <CollegeTrendChart />
    </div> */}


            
          </div>
        )}
      </div>
    </div>
  );
}

export default Predict;