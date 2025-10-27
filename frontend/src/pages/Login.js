import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [formData, setFormData] = useState({
    emailOrContact: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Trigger pop-up animation for cards
    const timer = setTimeout(() => {
      const cards = document.querySelectorAll('.role-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('pop-in');
        }, index * 150);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setShowLoginForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        role: selectedRole,
        emailOrContact: formData.emailOrContact,
        password: formData.password
      });

      // Store token and user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.name || "User");
      localStorage.setItem("userRole", response.data.role);

      // Navigate based on role
      if (response.data.role === "doctor" || response.data.role === "admin") {
        navigate("/doctor");
      } else if (response.data.role === "patient") {
        navigate("/patient");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBack = () => {
    if (showLoginForm) {
      setShowLoginForm(false);
      setSelectedRole(null);
      setError("");
      setFormData({ emailOrContact: "", password: "" });
    } else {
      navigate("/");
    }
  };

  if (showLoginForm) {
    return (
      <div className="login-page">
        <div className="login-container-simple">
          <a href="#" onClick={(e) => { e.preventDefault(); handleBack(); }} className="back-link">
            ← Back to Role Selection
          </a>
          <div className="login-form-card">
            <h1>Login as {selectedRole}</h1>
            
            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form-simple">
              <div className="form-group">
                <label htmlFor="emailOrContact">Email or Phone</label>
                <input
                  type="text"
                  id="emailOrContact"
                  name="emailOrContact"
                  placeholder="Enter your email or phone"
                  value={formData.emailOrContact}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="demo-credentials-simple">
                <p><strong>Demo:</strong></p>
                {selectedRole === "patient" && <p>john.doe@email.com / password123</p>}
                {selectedRole === "doctor" && <p>sarah.johnson@hospital.com / password123</p>}
                {selectedRole === "admin" && <p>admin@hospital.com / password123</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="role-selection-page">
      <div className="role-selection-container">
        <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); }} className="back-link">
          ← Back to Home
        </a>

        <div className="role-selection-header">
          <h1 className="role-title">Select Your Role</h1>
          <p className="role-subtitle">Choose how you'd like to access the system</p>
        </div>

        <div className="role-cards-container">
          <div className="role-card patient-card">
            <div className="role-icon-wrapper patient-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2ZM14 10H10V12H14V10ZM14 6H10V8H14V6Z"/>
              </svg>
            </div>
            <h3>Patient</h3>
            <p>Book appointments, view records, and manage your health</p>
            <button onClick={() => handleRoleSelect("patient")} className="continue-btn">
              Continue as Patient
            </button>
          </div>

          <div className="role-card doctor-card">
            <div className="role-icon-wrapper doctor-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6L10 8.5V7L8 8V10.5L10 9V11L21 9ZM3 13V22L12 24L21 22V13H3Z"/>
              </svg>
            </div>
            <h3>Doctor</h3>
            <p>Manage patients, appointments, and medical records</p>
            <button onClick={() => handleRoleSelect("doctor")} className="continue-btn">
              Continue as Doctor
            </button>
          </div>

          <div className="role-card admin-card">
            <div className="role-icon-wrapper admin-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 7.2 15.9 7.7C14.7 8.7 13.3 9.5 12 9.5C10.7 9.5 9.3 8.7 8.1 7.7C9.2 7.2 10.6 7 12 7ZM12 11.5C13.1 11.5 14.2 11.8 15.2 12.2C14.2 13 13 13.5 12 13.5C11 13.5 9.8 13 8.8 12.2C9.8 11.8 10.9 11.5 12 11.5ZM12 15.5C13.3 15.5 14.7 16 15.9 17C14.7 18 13.3 18.5 12 18.5C10.7 18.5 9.3 18 8.1 17C9.3 16 10.7 15.5 12 15.5Z"/>
              </svg>
            </div>
            <h3>Admin</h3>
            <p>Oversee operations, manage users, and view analytics</p>
            <button onClick={() => handleRoleSelect("admin")} className="continue-btn">
              Continue as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
