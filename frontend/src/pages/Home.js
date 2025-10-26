import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="home-page">
      {/* Header/Navigation */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="logo-text">MediCare</span>
          </div>
          
          <nav className="main-nav">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection("home"); }}>Home</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); scrollToSection("services"); }}>Services</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/doctors"); }}>Doctors</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); scrollToSection("about"); }}>About Us</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection("contact"); }}>Contact</a>
          </nav>
          
          <button className="login-btn-header" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-heading">
              Your Health, <span className="highlight">Our Priority</span>
            </h1>
            <p className="hero-description">
              Experience world-class healthcare with our comprehensive hospital management system. 
              Book appointments, access records, and connect with top medical professionals.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate("/login")}>
                Get Started
              </button>
              <button className="btn-secondary" onClick={() => navigate("/doctors")}>
                View Doctors
              </button>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-image-container">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop" 
                alt="Modern Hospital" 
                className="hero-image"
              />
              <div className="floating-elements">
                <div className="float-circle circle-1"></div>
                <div className="float-circle circle-2"></div>
                <div className="float-circle circle-3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive healthcare solutions tailored to your needs</p>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">📅</div>
              <h3>Appointment Booking</h3>
              <p>Book appointments online with our medical experts at your convenience.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">👨‍⚕️</div>
              <h3>Expert Doctors</h3>
              <p>Access to highly qualified medical professionals across all specialties.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🏥</div>
              <h3>Ward Management</h3>
              <p>Efficient ward assignment and management for optimal patient care.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📋</div>
              <h3>Medical Records</h3>
              <p>Secure digital storage and easy access to your medical history.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Billing & Payment</h3>
              <p>Transparent billing system with multiple payment options.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>Your data is protected with state-of-the-art security measures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About MediCare</h2>
              <p>
                MediCare is a modern, comprehensive hospital management system designed to streamline 
                healthcare operations and provide an exceptional experience for patients, doctors, and administrators.
              </p>
              <p>
                Our platform integrates appointment scheduling, patient management, ward allocation, 
                medical records, and billing into one seamless system. Built with the latest technologies, 
                MediCare ensures efficiency, security, and ease of use for all stakeholders.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Patients</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Doctors</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Wards</div>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop" alt="About Us" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Get In Touch</h2>
            <p>We're here to help you with any questions</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Address</h4>
                  <p>123 Medical Center Drive<br />Health City, HC 12345</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div>
                  <h4>Phone</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div>
                  <h4>Email</h4>
                  <p>info@medicare.com</p>
                </div>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <input type="text" placeholder="Your Name" />
                <input type="email" placeholder="Your Email" />
                <textarea placeholder="Your Message" rows="5"></textarea>
                <button type="submit" className="btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="logo-section">
                <div className="logo-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="logo-text">MediCare</span>
              </div>
              <p>Your health is our priority</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="#services">Appointments</a></li>
                <li><a href="#services">Medical Records</a></li>
                <li><a href="#services">Ward Management</a></li>
                <li><a href="#services">Billing</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect</h4>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 MediCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
