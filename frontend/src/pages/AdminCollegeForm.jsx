import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, X, Building2, MapPin, Calendar, Trophy, Users } from "lucide-react";
import "./AdminCollegeForm.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [colleges, setColleges] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCollege, setEditingCollege] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    establishedYear: "",
    ranking: "",
    image: "",
    branches: [],
    fees: { general: "", obc: "", sc: "", st: "", ews: "" },
    distanceFromRailway: { stationName: "", distanceKm: "" },
  });

  const branchOptions = [
    "Computer Engineering", "Mechanical Engineering", "Civil Engineering",
    "Electrical Engineering", "Electronics & Telecommunication",
    "Information Technology", "Artificial Intelligence", "Data Science",
    "Chemical Engineering", "Automobile Engineering",
  ];

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/colleges");
      const data = await res.json();
      setColleges(data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "", location: "", type: "", establishedYear: "", ranking: "",
      image: "", branches: [],
      fees: { general: "", obc: "", sc: "", st: "", ews: "" },
      distanceFromRailway: { stationName: "", distanceKm: "" },
    });
    setEditingCollege(null);
  };

  const handleBranchChange = (branch) => {
    setFormData((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCollege
      ? `http://localhost:8000/api/colleges/${editingCollege._id}`
      : "http://localhost:8000/api/colleges";
    const method = editingCollege ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert(editingCollege ? "College updated successfully!" : "College added successfully!");
        resetForm();
        fetchColleges();
        setActiveTab("list");
      } else {
        alert("Error saving college");
      }
    } catch (error) {
      alert("Error saving college");
    }
  };

  const handleEdit = (college) => {
    setEditingCollege(college);
    setFormData({
      name: college.name || "",
      location: college.location || "",
      type: college.type || "",
      establishedYear: college.establishedYear || "",
      ranking: college.ranking || "",
      image: college.image || "",
      branches: college.branches || [],
      fees: college.fees || { general: "", obc: "", sc: "", st: "", ews: "" },
      distanceFromRailway: college.distanceFromRailway || { stationName: "", distanceKm: "" },
    });
    setActiveTab("add");
  };

  const handleDelete = async () => {
    if (!collegeToDelete) return;
    try {
      const res = await fetch(`http://localhost:8000/api/colleges/${collegeToDelete._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("College deleted successfully!");
        fetchColleges();
        setShowDeleteModal(false);
        setCollegeToDelete(null);
      } else {
        alert("Error deleting college");
      }
    } catch (error) {
      alert("Error deleting college");
    }
  };

  const filteredColleges = colleges.filter((college) =>
    college.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-container">
          <h1 className="header-title">
            <Building2 size={32} />
            College Management Dashboard
          </h1>
          <p className="header-subtitle">Manage your college database efficiently</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <div className="nav-container">
          <button
            onClick={() => { setActiveTab("list"); resetForm(); }}
            className={`nav-tab ${activeTab === "list" ? "active" : ""}`}
          >
            All Colleges ({colleges.length})
          </button>
          <button
            onClick={() => { setActiveTab("add"); resetForm(); }}
            className={`nav-tab ${activeTab === "add" ? "active" : ""}`}
          >
            <Plus size={20} />
            {editingCollege ? "Edit College" : "Add New College"}
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* College List Tab */}
        {activeTab === "list" && (
          <div>
            {/* Search Bar */}
            <div className="search-section">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search by college name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
              <button onClick={() => setActiveTab("add")} className="btn-add-college">
                <Plus size={20} />
                Add College
              </button>
            </div>

            {/* College Cards Grid */}
            <div className="colleges-grid">
              {filteredColleges.map((college) => (
                <div key={college._id} className="college-card">
                  <div className="college-image">
                    {college.image ? (
                      <img src={college.image} alt={college.name} />
                    ) : (
                      <Building2 size={64} className="college-placeholder-icon" />
                    )}
                  </div>
                  <div className="college-details">
                    <h3 className="college-name">{college.name}</h3>
                    <div className="college-info">
                      <div className="info-row">
                        <MapPin size={16} className="info-icon" />
                        <span>{college.location}</span>
                      </div>
                      <div className="info-row">
                        <Calendar size={16} className="info-icon" />
                        <span>Est. {college.establishedYear}</span>
                      </div>
                      <div className="info-row">
                        <Trophy size={16} className="info-icon" />
                        <span>Rank: {college.ranking}</span>
                      </div>
                      <div className="info-row">
                        <Users size={16} className="info-icon" />
                        <span className="college-type-badge">{college.type}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleEdit(college)} className="btn-edit">
                        <Edit size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => { setCollegeToDelete(college); setShowDeleteModal(true); }}
                        className="btn-delete"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredColleges.length === 0 && (
              <div className="empty-state">
                <Building2 size={64} className="empty-icon" />
                <p className="empty-text">No colleges found</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit College Form Tab */}
        {activeTab === "add" && (
          <div className="form-container">
            <div className="form-header">
              <h2 className="form-title">
                {editingCollege ? "Edit College" : "Add New College"}
              </h2>
              {editingCollege && (
                <button onClick={resetForm} className="btn-close">
                  <X size={24} />
                </button>
              )}
            </div>

            <div className="form-content">
              <div className="form-grid-2">
                <div className="form-field form-field-full">
                  <label className="form-label">College Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Enter college name"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="form-input"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Autonomous">Autonomous</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label">Established Year</label>
                  <input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData({ ...formData, establishedYear: e.target.value })}
                    className="form-input"
                    placeholder="e.g., 1990"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label">Ranking</label>
                  <input
                    type="number"
                    value={formData.ranking}
                    onChange={(e) => setFormData({ ...formData, ranking: e.target.value })}
                    className="form-input"
                    placeholder="e.g., 50"
                  />
                </div>

                <div className="form-field form-field-full">
                  <label className="form-label">College Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              {/* Branches */}
              <div className="form-section">
                <label className="form-label">Available Branches</label>
                <div className="branch-grid">
                  {branchOptions.map((branch) => (
                    <label key={branch} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.branches.includes(branch)}
                        onChange={() => handleBranchChange(branch)}
                        className="checkbox-input"
                      />
                      <span className="checkbox-text">{branch}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Fees */}
              <div className="form-section">
                <label className="form-label">Fee Structure (₹ per year)</label>
                <div className="fee-grid">
                  {["general", "obc", "sc", "st", "ews"].map((cat) => (
                    <div key={cat} className="fee-field">
                      <label className="fee-label">{cat}</label>
                      <input
                        type="number"
                        name={cat}
                        value={formData.fees[cat]}
                        onChange={(e) => setFormData({
                          ...formData,
                          fees: { ...formData.fees, [cat]: e.target.value }
                        })}
                        className="form-input"
                        placeholder="Amount"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Railway Station */}
              <div className="form-section">
                <label className="form-label">Nearest Railway Station</label>
                <div className="form-grid-2">
                  <input
                    type="text"
                    name="stationName"
                    placeholder="Station Name"
                    value={formData.distanceFromRailway.stationName}
                    onChange={(e) => setFormData({
                      ...formData,
                      distanceFromRailway: { ...formData.distanceFromRailway, stationName: e.target.value }
                    })}
                    className="form-input"
                  />
                  <input
                    type="number"
                    name="distanceKm"
                    placeholder="Distance in KM"
                    value={formData.distanceFromRailway.distanceKm}
                    onChange={(e) => setFormData({
                      ...formData,
                      distanceFromRailway: { ...formData.distanceFromRailway, distanceKm: e.target.value }
                    })}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="form-actions">
                <button onClick={handleSubmit} className="btn-submit">
                  {editingCollege ? "Update College" : "Add College"}
                </button>
                <button
                  onClick={() => { resetForm(); setActiveTab("list"); }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                <Trash2 className="modal-icon" size={24} />
              </div>
              <h3 className="modal-title">Delete College</h3>
            </div>
            <p className="modal-text">
              Are you sure you want to delete <span className="modal-text-highlight">{collegeToDelete?.name}</span>? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={handleDelete} className="btn-modal-delete">
                Delete
              </button>
              <button
                onClick={() => { setShowDeleteModal(false); setCollegeToDelete(null); }}
                className="btn-modal-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;