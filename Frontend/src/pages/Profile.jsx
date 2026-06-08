import { useState, useEffect } from "react";
import { profileAPI, formAPI } from "../api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setError("");
    setLoading(true);
    try {
      const [profileRes, submissionsRes] = await Promise.all([
        profileAPI.getProfile(),
        formAPI.getSubmissions(),
      ]);
      setProfile(profileRes.data);
      setSubmissions(submissionsRes.data.submissions || []);
    } catch (err) {
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="content-page">
        <div className="page-loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="content-page">
      <div className="page-header">
        <h1>👤 Profile</h1>
        <p>Your personal account details.</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {profile && (
        <div className="profile-details">
          <div className="profile-card">
            <div className="profile-avatar">👤</div>
            <div className="profile-info">
              <div className="profile-row">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{profile.full_name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profile.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Date of Birth</span>
                <span className="profile-value">{profile.date_of_birth}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {submissions.length > 0 && (
        <div className="submissions-section">
          <h2>📋 Your Form Submissions</h2>
          <div className="submissions-list">
            {submissions.map((sub) => (
              <div key={sub.id} className="submission-card">
                <div className="submission-header">
                  <strong>{sub.name}</strong> ({sub.email})
                </div>
                <p className="submission-message">{sub.message}</p>
                <span className="submission-date">
                  {new Date(sub.submitted_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}