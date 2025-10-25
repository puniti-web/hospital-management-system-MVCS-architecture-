import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [formData, setFormData] = useState({
    emailOrContact: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        role: role,
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

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
        <div className="login-left">
          <div className="branding">
            <div className="logo-large">
              <span className="logo-icon-large">🏥</span>
              <h1>TEAM UTPA</h1>
            </div>
            <p className="tagline">Modern Hospital Management System</p>
            <div className="features">
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Easy Appointment Booking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Secure Patient Records</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2>Welcome Back</h2>
              <p>Login to access your dashboard</p>
            </div>

            {/* Role Selection */}
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${role === "patient" ? "active" : ""}`}
                onClick={() => setRole("patient")}
              >
                <span className="role-icon">👤</span>
                <span>Patient</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "doctor" ? "active" : ""}`}
                onClick={() => setRole("doctor")}
              >
                <span className="role-icon">👨‍⚕️</span>
                <span>Doctor</span>
              </button>
              <button
                type="button"
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                <span className="role-icon">⚙️</span>
                <span>Admin</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-alert">
                <span className="error-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="emailOrContact">Email or Phone</label>
                <input
                  type="text"
                  id="emailOrContact"
                  name="emailOrContact"
                  placeholder="Enter your email or phone number"
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

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password">
                  Forgot password?
                </a>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <span>Login</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <p className="demo-title">Demo Credentials:</p>
              <div className="demo-list">
                <div className="demo-item">
                  <strong>Patient:</strong> patient@example.com / patient123
                </div>
                <div className="demo-item">
                  <strong>Doctor:</strong> doctor@example.com / doctor123
                </div>
                <div className="demo-item">
                  <strong>Admin:</strong> admin@example.com / admin123
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
