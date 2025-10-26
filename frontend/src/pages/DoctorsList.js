import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./DoctorsList.css";

export default function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      // For now, using sample data. Replace with actual API call when backend is ready
      const sampleDoctors = [
        { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", contact: "9876543210", email: "sarah.johnson@hospital.com" },
        { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", contact: "9876543211", email: "michael.chen@hospital.com" },
        { id: 3, name: "Dr. Emily Rodriguez", specialization: "Orthopedics", contact: "9876543212", email: "emily.rodriguez@hospital.com" },
        { id: 4, name: "Dr. James Wilson", specialization: "Dermatology", contact: "9876543213", email: "james.wilson@hospital.com" },
        { id: 5, name: "Dr. Priya Sharma", specialization: "Pediatrics", contact: "9876543214", email: "priya.sharma@hospital.com" },
        { id: 6, name: "Dr. Robert Brown", specialization: "General", contact: "9876543215", email: "robert.brown@hospital.com" },
        { id: 7, name: "Dr. Lisa Anderson", specialization: "Cardiology", contact: "9876543216", email: "lisa.anderson@hospital.com" },
        { id: 8, name: "Dr. David Kumar", specialization: "Neurology", contact: "9876543217", email: "david.kumar@hospital.com" },
        { id: 9, name: "Dr. Maria Garcia", specialization: "Orthopedics", contact: "9876543218", email: "maria.garcia@hospital.com" },
        { id: 10, name: "Dr. John Smith", specialization: "General", contact: "9876543219", email: "john.smith@hospital.com" }
      ];
      setDoctors(sampleDoctors);
    } catch (error) {
      console.error("Error loading doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const specializations = ["all", ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === "all" || 
                                 doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      // API call to book appointment
      await api.post("/appointments", {
        doctorId: selectedDoctor.id,
        patientName: bookingData.patientName,
        appointmentDate: bookingData.appointmentDate,
        appointmentTime: bookingData.appointmentTime,
        reason: bookingData.reason
      });
      
      setShowBookingModal(false);
      setSelectedDoctor(null);
      alert("Appointment booked successfully!");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="doctors-list-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading doctors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="doctors-list-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Medical Team</h1>
          <p>Meet our experienced doctors and specialists</p>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search doctors by name or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="specialization-filter">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === "all" ? "All Specializations" : spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="doctor-card">
              <div className="doctor-avatar">
                {doctor.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialization">{doctor.specialization}</p>
                <div className="contact-info">
                  <p>📞 {doctor.contact}</p>
                  <p>✉️ {doctor.email}</p>
                </div>
                <button 
                  className="book-btn"
                  onClick={() => handleBookAppointment(doctor)}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="no-results">
            <p>No doctors found matching your criteria.</p>
          </div>
        )}
      </div>

      {showBookingModal && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
}

// Booking Modal Component
function BookingModal({ doctor, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    patientName: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay">
      <div className="booking-modal">
        <div className="modal-header">
          <h2>Book Appointment with {doctor.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label>Patient Name</label>
            <input
              type="text"
              name="patientName"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Appointment Date</label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Appointment Time</label>
            <select
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            >
              <option value="">Select Time</option>
              <option value="09:00">9:00 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="12:00">12:00 PM</option>
              <option value="14:00">2:00 PM</option>
              <option value="15:00">3:00 PM</option>
              <option value="16:00">4:00 PM</option>
              <option value="17:00">5:00 PM</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Reason for Visit</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Brief description of your symptoms or reason for visit"
              rows="3"
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
