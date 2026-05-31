import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/auth/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setUser(data.user);
        setEditedUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...user });
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser.user);
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="auth-message">
          <h2>Please log in to view your profile</h2>
          <p>You need to be authenticated to access your student profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user.name?.charAt(0).toUpperCase() || 'S'}
        </div>
        <div className="profile-title">
          <h1>Student Profile</h1>
          <p className="profile-subtitle">Manage your academic information</p>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="card-header">
            <h2>Personal Information</h2>
            {!isEditing ? (
              <button className="edit-btn" onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="card-content">
            <div className="info-grid">
              <div className="info-item">
                <label className="info-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="info-input"
                    value={editedUser.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{user.name || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="info-input"
                    value={editedUser.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{user.email || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="info-input"
                    value={editedUser.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="info-value">{user.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    className="info-input"
                    value={editedUser.dateOfBirth || ''}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  />
                ) : (
                  <p className="info-value">{user.dateOfBirth || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Current Class</label>
                {isEditing ? (
                  <select
                    className="info-input"
                    value={editedUser.currentClass || ''}
                    onChange={(e) => handleInputChange('currentClass', e.target.value)}
                  >
                    <option value="">Select Class</option>
                    <option value="10th">10th Grade</option>
                    <option value="11th">11th Grade</option>
                    <option value="12th">12th Grade</option>
                    <option value="Graduate">Under Graduate</option>
                    <option value="Graduate">Post Graduate</option>
                  </select>
                ) : (
                  <p className="info-value">{user.currentClass || 'Not provided'}</p>
                )}
              </div>

              <div className="info-item">
                <label className="info-label">Stream/Branch</label>
                {isEditing ? (
                  <select
                    className="info-input"
                    value={editedUser.stream || ''}
                    onChange={(e) => handleInputChange('stream', e.target.value)}
                  >
                    <option value="">Select Stream</option>
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Arts">Arts</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Medical">Medical</option>
                  </select>
                ) : (
                  <p className="info-value">{user.stream || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

      <div className="profile-card"> 
  <div className="card-header">
    <h2>Academic Information</h2>
  </div>
  <div className="card-content">
    <div className="info-grid">
      {/* 10th Grade Percentage */}
      <div className="info-item">
        <label className="info-label">10th Grade Percentage</label>
        {isEditing ? (
          <input
            type="number"
            className="info-input"
            value={editedUser.tenthPercentage || ''}
            onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
            placeholder="Enter percentage"
            min="0"
            max="100"
          />
        ) : (
          <p className="info-value">{user.tenthPercentage ? `${user.tenthPercentage}%` : 'Not provided'}</p>
        )}
      </div>

      {/* 10th Board Name */}
      <div className="info-item">
        <label className="info-label">10th Board</label>
        {isEditing ? (
          <input
            type="text"
            className="info-input"
            value={editedUser.tenthBoard || ''}
            onChange={(e) => handleInputChange('tenthBoard', e.target.value)}
            placeholder="Enter board name"
          />
        ) : (
          <p className="info-value">{user.tenthBoard || 'Not provided'}</p>
        )}
      </div>

      {/* 12th Grade Percentage */}
      <div className="info-item">
        <label className="info-label">12th Grade Percentage</label>
        {isEditing ? (
          <input
            type="number"
            className="info-input"
            value={editedUser.twelfthPercentage || ''}
            onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
            placeholder="Enter percentage"
            min="0"
            max="100"
          />
        ) : (
          <p className="info-value">{user.twelfthPercentage ? `${user.twelfthPercentage}%` : 'Not provided'}</p>
        )}
      </div>

      {/* 12th Board Name */}
      <div className="info-item">
        <label className="info-label">12th Board</label>
        {isEditing ? (
          <input
            type="text"
            className="info-input"
            value={editedUser.twelfthBoard || ''}
            onChange={(e) => handleInputChange('twelfthBoard', e.target.value)}
            placeholder="Enter board name"
          />
        ) : (
          <p className="info-value">{user.twelfthBoard || 'Not provided'}</p>
        )}
      </div>

      {/* JEE Main Score */}
      <div className="info-item">
        <label className="info-label">JEE Main Score</label>
        {isEditing ? (
          <input
            type="number"
            className="info-input"
            value={editedUser.jeeMainScore || ''}
            onChange={(e) => handleInputChange('jeeMainScore', e.target.value)}
            placeholder="Enter JEE Main score"
            min="0"
            max="300"
          />
        ) : (
          <p className="info-value">{user.jeeMainScore || 'Not provided'}</p>
        )}
      </div>

      {/* MHTCET Score */}
      <div className="info-item">
        <label className="info-label">MHTCET Score</label>
        {isEditing ? (
          <input
            type="number"
            className="info-input"
            value={editedUser.mhtcetScore || ''}
            onChange={(e) => handleInputChange('mhtcetScore', e.target.value)}
            placeholder="Enter MHTCET score"
            min="0"
            max="720"
          />
        ) : (
          <p className="info-value">{user.mhtcetScore || 'Not provided'}</p>
        )}
      </div>

      {/* University Name */}
      <div className="info-item">
        <label className="info-label">University Name</label>
        {isEditing ? (
          <input
            type="text"
            className="info-input"
            value={editedUser.university || ''}
            onChange={(e) => handleInputChange('university', e.target.value)}
            placeholder="Enter university name"
          />
        ) : (
          <p className="info-value">{user.university || 'Not provided'}</p>
        )}
      </div>

      {/* Graduation Percentage (Optional) */}
      <div className="info-item">
        <label className="info-label">Graduation Percentage</label>
        {isEditing ? (
          <input
            type="number"
            className="info-input"
            value={editedUser.graduationPercentage || ''}
            onChange={(e) => handleInputChange('graduationPercentage', e.target.value)}
            placeholder="Enter percentage"
            min="0"
            max="100"
          />
        ) : (
          <p className="info-value">{user.graduationPercentage ? `${user.graduationPercentage}%` : 'Not provided'}</p>
        )}
      </div>
       {/* Category */}
<div className="info-item">
  <label className="info-label">Category</label>
  {isEditing ? (
    <input
      type="text"
      className="info-input"
      value={editedUser.category ?? ''} // controlled input
      onChange={(e) => handleInputChange('category', e.target.value)}
      placeholder="Enter your category"
    />
  ) : (
    <p className="info-value">{user.category ?? 'Not provided'}</p>
  )}
</div>

      {/* BRANCES */}
<div className="info-item">
  <label className="info-label">Branch</label>
  {isEditing ? (
    <input
      type="text"
      className="info-input"
      value={editedUser.branch ?? ''} // controlled input
      onChange={(e) => handleInputChange('branch', e.target.value)}
      placeholder="Enter your branch"
    />
  ) : (
    <p className="info-value">{user.branch ?? 'Not provided'}</p>
  )}
</div>
    </div>
  </div>
</div>


        <div className="profile-card">
          <div className="card-header">
            <h2>Preferences & Goals</h2>
          </div>
          <div className="card-content">
            <div className="info-item full-width">
              <label className="info-label">Career Interests</label>
              {isEditing ? (
                <textarea
                  className="info-textarea"
                  value={editedUser.careerInterests || ''}
                  onChange={(e) => handleInputChange('careerInterests', e.target.value)}
                  placeholder="Describe your career interests and goals..."
                  rows="4"
                />
              ) : (
                <p className="info-value">{user.careerInterests || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item full-width">
              <label className="info-label">Preferred College Location</label>
              {isEditing ? (
                <input
                  type="text"
                  className="info-input"
                  value={editedUser.preferredLocation || ''}
                  onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                  placeholder="Enter preferred locations (e.g., Mumbai, Delhi, Bangalore)"
                />
              ) : (
                <p className="info-value">{user.preferredLocation || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      <button
  onClick={async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    try {
      const res = await fetch("http://localhost:8000/api/auth/delete-account", {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        alert("Account deleted");
        window.location.href = "/login";
      } else {
        const data = await res.json();
        alert("Failed: " + data.error);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  }}
  className="delete-account-button"
>
  Delete Account
</button>


      </div>
    </div>
    
  );
}

export default Profile;