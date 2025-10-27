import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Patient.css";
import Appointments from "../components/Appointments";
import Doctors from "../components/Doctors";
import MedicalRecords from "../components/MedicalRecords";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Patient");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Patient";
    setPatientName(name);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // --- Appointments
      const apptRes = await api.get("/appointments/patient/my");
      const appts = apptRes?.data?.data ?? apptRes?.data ?? [];
      setAppointments(appts);

      // --- Bills (optional endpoint)
      try {
        const billsRes = await api.get("/billing/my");
        const billsRaw = billsRes?.data?.data ?? billsRes?.data ?? [];
        setBills(billsRaw);
      } catch {
        console.log("Billing API not available");
      }

      // --- Medicines
      try {
        const medicinesRes = await api.get("/medicines");
        const medicinesData = medicinesRes?.data?.data ?? medicinesRes?.data ?? [];
        setMedicines(medicinesData);
      } catch {
        console.log("Medicines API error");
        setMedicines([]);
      }

      // --- Doctors
      try {
        const doctorsRes = await api.get("/doctors");
        const rows =
          doctorsRes?.data?.data ??
          doctorsRes?.data?.doctors ??
          doctorsRes?.data ??
          [];

        let normalized = rows.map((d) => {
          const specRaw = d.Specialization ?? d.specialization ?? "General";
          const spec = (specRaw || "General").toString().trim();
          console.log("🔧 Normalizing doctor:", {
            id: d.DoctorID ?? d.id,
            name: (d.Name ?? d.name ?? "").toString().trim(),
            specialization: spec,
            rawSpecialization: d.Specialization ?? d.specialization
          });
          return {
            id: d.DoctorID ?? d.id, // must be the numeric DB id
            name: (d.Name ?? d.name ?? "").toString().trim(),
            specialization: spec,
            contact: d.Contact ?? d.contact ?? "",
            email: d.Email ?? d.email ?? "",
          };
        });

        if (!Array.isArray(normalized) || normalized.length === 0) {
          console.warn("No doctors from API — using fallback list");
          normalized = [
            { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology",  contact: "9876543210", email: "sarah.johnson@hospital.com" },
            { id: 2, name: "Dr. Michael Chen",  specialization: "Neurology",   contact: "9876543211", email: "michael.chen@hospital.com" },
            { id: 3, name: "Dr. Emily Rodriguez", specialization: "Orthopedics", contact: "9876543212", email: "emily.rodriguez@hospital.com" },
            { id: 4, name: "Dr. James Wilson",   specialization: "Dermatology", contact: "9876543213", email: "james.wilson@hospital.com" },
            { id: 5, name: "Dr. Priya Sharma",   specialization: "Pediatrics",  contact: "9876543214", email: "priya.sharma@hospital.com" },
            { id: 6, name: "Dr. John Smith",     specialization: "General",     contact: "9876543219", email: "john.smith@hospital.com" },
          ];
        }

        setDoctors(normalized);
        console.log("✅ Doctors loaded:", normalized.length, "doctors");
        console.log("Doctor details:", normalized.map(d => `${d.name} - ${d.specialization}`));
      } catch {
        console.log("Doctors API error — using fallback list");
        setDoctors([
          { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology",  contact: "9876543210", email: "sarah.johnson@hospital.com" },
          { id: 2, name: "Dr. Michael Chen",  specialization: "Neurology",   contact: "9876543211", email: "michael.chen@hospital.com" },
          { id: 3, name: "Dr. Emily Rodriguez", specialization: "Orthopedics", contact: "9876543212", email: "emily.rodriguez@hospital.com" },
        ]);
      }
    } catch (e) {
      console.error("Error loading data:", e);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <div className="patient-layout">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        logout={logout}
        patientName={patientName}
      />

      <main className="main-content">
        <TopHeader patientName={patientName} />

        <div className="content-wrapper">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {currentView === "dashboard" && (
                <Overview appointments={appointments} bills={bills} />
              )}
              {currentView === "appointments" && (
                <Appointments
                  appointments={appointments}
                  doctors={doctors}
                  reload={loadData}
                />
              )}
              {currentView === "book-appointment" && (
                <BookAppointment doctors={doctors} reload={loadData} />
              )}
              {currentView === "patient-registration" && (
                <PatientRegistration />
              )}
              {currentView === "doctors" && <MyDoctors appointments={appointments} />}
              {currentView === "inventory" && <MedicinesInventory medicines={medicines} />}
              {currentView === "billing" && <Billing bills={bills} medicines={medicines} />}
              {currentView === "records" && (
                <MedicalRecords appointments={appointments} />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

/* ===================== Sidebar ===================== */
function Sidebar({ currentView, setCurrentView, logout, patientName }) {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "book-appointment", icon: "➕", label: "Book Appointment" },
    { id: "patient-registration", icon: "👤", label: "Patient Registration" },
    { id: "doctors", icon: "👨‍⚕", label: "My Doctors" },
    { id: "inventory", icon: "💊", label: "Medicines" },
    { id: "records", icon: "📋", label: "Medical Records" },
    { id: "billing", icon: "💳", label: "Billing" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">MediCare</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentView === item.id ? "active" : ""}`}
            onClick={() => setCurrentView(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{patientName.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <div className="user-name">{patientName}</div>
            <div className="user-role">Patient</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

/* ===================== Top Header ===================== */
function TopHeader({ patientName }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <h2>Welcome back, {patientName}!</h2>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔 <span className="badge">2</span>
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=${patientName}&background=10b981&color=fff`}
          alt="User"
          className="user-avatar-small"
        />
      </div>
    </header>
  );
}

/* ===================== Overview ===================== */
function Overview({ appointments, bills }) {
  const upcomingAppts = appointments.filter(
    (a) => new Date(a.AppointmentDate) >= new Date()
  );
  const nextAppointment = upcomingAppts[0];
  const totalBills = bills.reduce((sum, b) => sum + (b.Amount || 0), 0);
  const pendingBills = bills.filter((b) => b.PaymentStatus === "Pending").length;

  const stats = [
    { icon: "📅", title: "Upcoming Appointments", value: upcomingAppts.length, color: "#6366f1" },
    { icon: "👨‍⚕", title: "My Doctors", value: new Set(appointments.map(a => a.DoctorName)).size, color: "#10b981" },
    { icon: "💳", title: "Pending Bills", value: pendingBills, color: "#f59e0b" },
    { icon: "📋", title: "Total Visits", value: appointments.length, color: "#3b82f6" },
  ];

  return (
    <div className="overview-container">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ background: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {nextAppointment && (
        <div className="next-appointment-card">
          <div className="appointment-badge">Next Appointment</div>
          <div className="appointment-details-large">
            <div className="appointment-date-large">
              <span className="day">{new Date(nextAppointment.AppointmentDate).getDate()}</span>
              <span className="month">
                {new Date(nextAppointment.AppointmentDate).toLocaleDateString("en", {
                  month: "short",
                })}
              </span>
            </div>
            <div className="appointment-info-large">
              <h3>Dr. {nextAppointment.DoctorName}</h3>
              <p className="specialization">{nextAppointment.Specialization}</p>
              <p className="time">
                ⏰ {formatTime(nextAppointment.StartTime)} - {formatTime(nextAppointment.EndTime)}
              </p>
            </div>
            <div className="appointment-actions">
              <button className="btn-reschedule">Reschedule</button>
              <button className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Medicines Inventory ===================== */
function MedicinesInventory({ medicines }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const categories = ["all", ...new Set(medicines.map(m => m.Category))];

  const filtered = medicines.filter((med) => {
    const matchesSearch = 
      (med.Name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (med.Category?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || med.Category === filter;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount) => `₹${Number(amount).toFixed(2)}`;

  return (
    <div className="medicines-container">
      <h1 className="page-title">💊 Medicine Inventory</h1>

      <div className="filters-bar">
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Medicine List</h2>
          <span className="badge-count">{filtered.length} medicines</span>
        </div>
        <div className="card-body no-padding">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Manufacturer</th>
                <th>Price</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => (
                <tr key={med.MedicineID}>
                  <td><strong>{med.Name}</strong></td>
                  <td>{med.Category}</td>
                  <td>{med.Manufacturer}</td>
                  <td>{formatCurrency(med.Price)}</td>
                  <td>
                    <span className={`status-badge ${med.Stock > 50 ? 'active' : 'pending'}`}>
                      {med.Stock} units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="stats-grid" style={{ marginTop: '24px', gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-icon" style={{ background: '#10b98115' }}>💊</div>
          <div className="stat-content">
            <div className="stat-title">Total Medicines</div>
            <div className="stat-value">{medicines.length}</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-icon" style={{ background: '#3b82f615' }}>📦</div>
          <div className="stat-content">
            <div className="stat-title">Categories</div>
            <div className="stat-value">{categories.length - 1}</div>
          </div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-icon" style={{ background: '#f59e0b15' }}>💰</div>
          <div className="stat-content">
            <div className="stat-title">Avg Price</div>
            <div className="stat-value">
              ₹{medicines.length > 0 ? (medicines.reduce((sum, m) => sum + Number(m.Price), 0) / medicines.length).toFixed(0) : '0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===================== Billing ===================== */
function Billing({ bills, medicines }) {
  const totalAmount = bills.reduce((sum, bill) => sum + (bill.Amount || 0), 0);
  const pendingAmount = bills
    .filter((b) => b.PaymentStatus === "Pending")
    .reduce((sum, b) => sum + (b.Amount || 0), 0);

  // Calculate medicine costs based on appointments
  const medicineTotal = medicines.length > 0 
    ? medicines.reduce((sum, med) => sum + Number(med.Price), 0) * 0.3 
    : 0;
  const grandTotal = totalAmount + medicineTotal;

  return (
    <div className="billing-container">
      <h1 className="page-title">💳 Billing & Payments</h1>

      <div className="billing-stats">
        <div className="billing-stat-card">
          <span className="billing-stat-label">Consultation Fees</span>
          <span className="billing-stat-value">₹{totalAmount}</span>
        </div>
        <div className="billing-stat-card">
          <span className="billing-stat-label">Medicine Costs</span>
          <span className="billing-stat-value">₹{medicineTotal.toFixed(2)}</span>
        </div>
        <div className="billing-stat-card pending">
          <span className="billing-stat-label">Total Due</span>
          <span className="billing-stat-value">₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Billing History</h2>
        </div>
        <div className="card-body no-padding">
          {bills.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💳</span>
              <p>No bills yet</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <tr key={i}>
                    <td>{formatDate(bill.DateIssued)}</td>
                    <td>Medical Services</td>
                    <td>₹{bill.Amount}</td>
                    <td>
                      <span className={`status-badge ${bill.PaymentStatus.toLowerCase()}`}>
                        {bill.PaymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== My Doctors ===================== */
function MyDoctors({ appointments }) {
  // Extract unique doctors from appointments
  const myDoctors = appointments
    .filter(apt => apt.DoctorName && apt.Specialization)
    .reduce((acc, apt) => {
      if (!acc.find(d => d.name === apt.DoctorName)) {
        acc.push({
          id: apt.DoctorID || Math.random(),
          name: apt.DoctorName,
          specialization: apt.Specialization,
          contact: apt.DoctorContact || "N/A",
          email: apt.DoctorEmail || "N/A"
        });
      }
      return acc;
    }, []);

  return (
    <div className="my-doctors-container">
      <h1 className="page-title">👨‍⚕️ My Doctors</h1>

      <div className="card">
        <div className="card-header">
          <h2>Doctors I've Visited</h2>
          <span className="badge-count">{myDoctors.length} doctors</span>
        </div>
        <div className="card-body">
          {myDoctors.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">👨‍⚕️</span>
              <p>No doctors yet. Book an appointment to see your doctors here!</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {myDoctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card-full">
                  <div className="doctor-avatar-large">
                    {doctor.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="doctor-info-full">
                    <h3>{doctor.name}</h3>
                    <p className="specialization-label">{doctor.specialization}</p>
                    <div className="doctor-contact-info">
                      <p>📞 {doctor.contact}</p>
                      <p>✉️ {doctor.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===================== Helpers ===================== */
function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}

function formatTime(time) {
  if (!time) return "N/A";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* ===================== Book Appointment ===================== */
function BookAppointment({ doctors, reload }) {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    problem: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    status: "Scheduled" // Default status as per schema
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Problem -> specialization mapping
  const problems = [
    { id: "chest-pain", name: "Chest Pain", specialization: "Cardiology", icon: "❤️" },
    { id: "headache", name: "Headache/Migraine", specialization: "Neurology", icon: "🧠" },
    { id: "joint-pain", name: "Joint Pain", specialization: "Orthopedics", icon: "🦴" },
    { id: "skin-rash", name: "Skin Rash", specialization: "Dermatology", icon: "🦠" },
    { id: "child-fever", name: "Child Fever", specialization: "Pediatrics", icon: "👶" },
    { id: "general-checkup", name: "General Checkup", specialization: "General", icon: "🩺" },
    { id: "back-pain", name: "Back Pain", specialization: "Orthopedics", icon: "🦴" },
    { id: "heart-palpitations", name: "Heart Palpitations", specialization: "Cardiology", icon: "❤️" },
    { id: "memory-issues", name: "Memory Issues", specialization: "Neurology", icon: "🧠" },
    { id: "acne", name: "Acne/Skin Issues", specialization: "Dermatology", icon: "🦠" }
  ];

  const canonical = (s) => (s || "").toString().toLowerCase().trim();
  const specMatch = (docSpec, probSpec) => {
    const a = canonical(docSpec);
    const b = canonical(probSpec);
    const matches = !!a && !!b && (a === b || a.includes(b) || b.includes(a));
    console.log("🔍 Comparing:", { docSpec, probSpec, a, b, matches });
    return matches;
  };

  const getFilteredDoctors = () => {
    if (!formData.problem) return doctors;
    const sel = problems.find((p) => p.id === formData.problem);
    const desired = sel?.specialization || "General";
    console.log("🔍 Filtering doctors:", {
      problemId: formData.problem,
      desired: desired,
      totalDoctors: doctors.length,
      allSpecializations: [...new Set(doctors.map(d => d.specialization))]
    });
    const filtered = doctors.filter((d) => specMatch(d.specialization, desired));
    console.log("✅ Filtered doctors:", filtered.length, "found");
    console.log("Filtered details:", filtered.map(d => `${d.name} - ${d.specialization}`));
    return filtered; // Return filtered results (empty if no match)
  };

  const handleProblemSelect = (problemId) => {
    setFormData((prev) => ({ ...prev, problem: problemId, doctorId: "" }));
    setCurrentStage(2);
  };

  const handleDoctorSelect = (doctorId) => {
    setFormData((prev) => ({ ...prev, doctorId }));
    setCurrentStage(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // "HH:MM" -> "HH:MM:SS"; end = start + 1h
      const [hStr, mStr] = formData.appointmentTime.split(":");
      const endH = String((parseInt(hStr, 10) + 1) % 24).padStart(2, "0");
      const startTime = `${hStr}:${mStr}:00`;
      const endTime = `${endH}:${mStr}:00`;

      await api.post("/appointments/book", {
        doctorId: formData.doctorId,                // numeric ID
        appointmentDate: formData.appointmentDate,  // YYYY-MM-DD
        startTime,
        endTime,
        reason: formData.reason,
        status: formData.status
      });

      setSuccess(true);
      setFormData({ problem: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "" });
      setCurrentStage(1);
      reload();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert(error?.response?.data?.message || "Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const goBack = () => currentStage > 1 && setCurrentStage((s) => s - 1);

  return (
    <div className="book-appointment-container">
      <h1 className="page-title">📅 Book New Appointment</h1>

      {success && (
        <div className="success-alert">
          <span className="success-icon">✅</span>
          <span>Appointment booked successfully!</span>
        </div>
      )}

      {/* Progress */}
      <div className="progress-indicator">
        <div className={`progress-step ${currentStage >= 1 ? "active" : ""}`}>
          <span className="step-number">1</span>
          <span className="step-label">Select Problem</span>
        </div>
        <div className={`progress-step ${currentStage >= 2 ? "active" : ""}`}>
          <span className="step-number">2</span>
          <span className="step-label">Choose Doctor</span>
        </div>
        <div className={`progress-step ${currentStage >= 3 ? "active" : ""}`}>
          <span className="step-number">3</span>
          <span className="step-label">Schedule</span>
        </div>
      </div>

      <div className="booking-form-card">
        {/* Stage 1 */}
        {currentStage === 1 && (
          <div className="stage-container">
            <h2>What's your main concern?</h2>
            <p className="stage-description">Select the problem that best describes your symptoms</p>

            <div className="problems-grid">
              {problems.map((problem) => (
                <button
                  key={problem.id}
                  className="problem-card"
                  onClick={() => handleProblemSelect(problem.id)}
                >
                  <span className="problem-icon">{problem.icon}</span>
                  <span className="problem-name">{problem.name}</span>
                  <span className="problem-specialization">{problem.specialization}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2 */}
        {currentStage === 2 && (
          <div className="stage-container">
            <div className="stage-header">
              <button className="back-btn" onClick={goBack}>← Back</button>
              <h2>Choose Your Doctor</h2>
            </div>
            <p className="stage-description">
              Select from our specialists in {problems.find((p) => p.id === formData.problem)?.specialization}
            </p>

            <div className="doctors-selection">
              {getFilteredDoctors().map((doctor) => (
                <button
                  key={doctor.id}
                  className={`doctor-selection-card ${String(formData.doctorId) === String(doctor.id) ? "selected" : ""}`}
                  onClick={() => handleDoctorSelect(doctor.id)}
                >
                  <div className="doctor-avatar-small">
                    {doctor.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="doctor-info-small">
                    <h3>{doctor.name}</h3>
                    <p>{doctor.specialization}</p>
                    <p className="doctor-contact">📞 {doctor.contact}</p>
                  </div>
                </button>
              ))}
            </div>

            {getFilteredDoctors().length === 0 && (
              <div className="no-doctors">
                <p>No doctors available for this specialization. Please try a different problem.</p>
                <button className="btn-secondary" onClick={() => setCurrentStage(1)}>
                  Choose Different Problem
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stage 3 */}
        {currentStage === 3 && (
          <div className="stage-container">
            <div className="stage-header">
              <button className="back-btn" onClick={goBack}>← Back</button>
              <h2>Schedule Your Appointment</h2>
            </div>

            <div className="selected-doctor-info">
              <h3>
                Selected Doctor:{" "}
                {doctors.find((d) => String(d.id) === String(formData.doctorId))?.name || "—"}
              </h3>
              <p>
                Specialization: {problems.find((p) => p.id === formData.problem)?.specialization}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="appointmentDate">Appointment Date</label>
                  <input
                    type="date"
                    id="appointmentDate"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="appointmentTime">Appointment Time</label>
                  <select
                    id="appointmentTime"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select time</option>
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
              </div>

              <div className="form-group">
                <label htmlFor="reason">Additional Notes (Optional)</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  placeholder="Any additional information about your symptoms or concerns"
                  rows="3"
                />
              </div>

              <button type="submit" className="book-appointment-btn" disabled={loading}>
                {loading ? "Booking..." : "Confirm Appointment"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================== Patient Registration ===================== */
function PatientRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await api.post("/patients/register", formData);
      setSuccess(true);
      setFormData({
        name: "",
        age: "",
        gender: "",
        contact: "",
        address: "",
        email: "",
        password: ""
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error registering patient:", error);
      alert(error?.response?.data?.message || "Failed to register patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-registration-container">
      <h1 className="page-title">👤 Patient Registration</h1>

      {success && (
        <div className="success-alert">
          <span className="success-icon">✅</span>
          <span>Patient registered successfully!</span>
        </div>
      )}

      <div className="registration-form-card">
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age *</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                min="1"
                max="120"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="contact">Contact Number *</label>
              <input
                type="tel"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Enter your contact number"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your complete address"
              rows="3"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter a secure password"
                minLength="6"
                required
              />
            </div>
          </div>

          <button type="submit" className="register-patient-btn" disabled={loading}>
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import "./Patient.css";
// import Appointments from "../components/Appointments";
// import Doctors from "../components/Doctors";
// import MedicalRecords from "../components/MedicalRecords";


// export default function PatientDashboard() {
//   const navigate = useNavigate();
//   const [currentView, setCurrentView] = useState("dashboard");
//   const [appointments, setAppointments] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [bills, setBills] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [patientName, setPatientName] = useState("Patient");

//   useEffect(() => {
//     const name = localStorage.getItem("userName") || "Patient";
//     setPatientName(name);
//     loadData();
//   }, [navigate]);

//   const loadData = async () => {
//     setLoading(true);
//     try {
//       // Load appointments
//       const appointmentsRes = await api.get("/appointments/patient/my");
//       setAppointments(appointmentsRes.data);

//       // Load bills
//       try {
//         const billsRes = await api.get("/billing/my");
//         setBills(billsRes.data);
//       } catch (err) {
//         console.log("Bills not available");
//       }

//       // Load all doctors from database
//       try {
//         const doctorsRes = await api.get("/doctors");
//         setDoctors(doctorsRes.data);
//       } catch (err) {
//         console.log("Doctors API not available, using sample data");
//         // Fallback to sample doctors data
//         const sampleDoctors = [
//           { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", contact: "9876543210", email: "sarah.johnson@hospital.com" },
//           { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", contact: "9876543211", email: "michael.chen@hospital.com" },
//           { id: 3, name: "Dr. Emily Rodriguez", specialization: "Orthopedics", contact: "9876543212", email: "emily.rodriguez@hospital.com" },
//           { id: 4, name: "Dr. James Wilson", specialization: "Dermatology", contact: "9876543213", email: "james.wilson@hospital.com" },
//           { id: 5, name: "Dr. Priya Sharma", specialization: "Pediatrics", contact: "9876543214", email: "priya.sharma@hospital.com" },
//           { id: 6, name: "Dr. Robert Brown", specialization: "General", contact: "9876543215", email: "robert.brown@hospital.com" },
//           { id: 7, name: "Dr. Lisa Anderson", specialization: "Cardiology", contact: "9876543216", email: "lisa.anderson@hospital.com" },
//           { id: 8, name: "Dr. David Kumar", specialization: "Neurology", contact: "9876543217", email: "david.kumar@hospital.com" },
//           { id: 9, name: "Dr. Maria Garcia", specialization: "Orthopedics", contact: "9876543218", email: "maria.garcia@hospital.com" },
//           { id: 10, name: "Dr. John Smith", specialization: "General", contact: "9876543219", email: "john.smith@hospital.com" }
//         ];
//         setDoctors(sampleDoctors);
//       }
//     } catch (error) {
//       console.error("Error loading data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("userName");
//     navigate("/");
//   };

//   return (
//     <div className="patient-layout">
//       <Sidebar
//         currentView={currentView}
//         setCurrentView={setCurrentView}
//         logout={logout}
//         patientName={patientName}
//       />

//       <main className="main-content">
//         <TopHeader patientName={patientName} />

//         <div className="content-wrapper">
//           {loading ? (
//             <LoadingSpinner />
//           ) : (
//             <>
//               {currentView === "dashboard" && (
//                 <Overview appointments={appointments} bills={bills} />
//               )}
//               {currentView === "appointments" && (
//                 <Appointments
//                   appointments={appointments}
//                   doctors={doctors}
//                   reload={loadData}
//                 />
//               )}
//               {currentView === "book-appointment" && (
//                 <BookAppointment doctors={doctors} reload={loadData} />
//               )}
//               {currentView === "doctors" && <Doctors doctors={doctors} />}
//               {currentView === "billing" && <Billing bills={bills} />}
//               {currentView === "records" && (
//                 <MedicalRecords appointments={appointments} />
//               )}
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// // ======== SIDEBAR ========
// function Sidebar({ currentView, setCurrentView, logout, patientName }) {
//   const menuItems = [
//     { id: "dashboard", icon: "🏠", label: "Dashboard" },
//     { id: "appointments", icon: "📅", label: "Appointments" },
//     { id: "book-appointment", icon: "➕", label: "Book Appointment" },
//     { id: "doctors", icon: "👨‍⚕", label: "My Doctors" },
//     { id: "records", icon: "📋", label: "Medical Records" },
//     { id: "billing", icon: "💳", label: "Billing" },
//   ];

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <div className="logo">
//           <span className="logo-icon">🏥</span>
//           <span className="logo-text">MediCare</span>
//         </div>
//       </div>

//       <nav className="sidebar-nav">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             className={`nav-item ${currentView === item.id ? "active" : ""}`}
//             onClick={() => setCurrentView(item.id)}
//           >
//             <span className="nav-icon">{item.icon}</span>
//             <span className="nav-label">{item.label}</span>
//           </button>
//         ))}
//       </nav>

//       <div className="sidebar-footer">
//         <div className="user-info">
//           <div className="user-avatar">{patientName.charAt(0).toUpperCase()}</div>
//           <div className="user-details">
//             <div className="user-name">{patientName}</div>
//             <div className="user-role">Patient</div>
//           </div>
//         </div>
//         <button className="logout-btn" onClick={logout}>
//           <span>🚪</span> Logout
//         </button>
//       </div>
//     </aside>
//   );
// }

// // ======== TOP HEADER ========
// function TopHeader({ patientName }) {
//   return (
//     <header className="top-header">
//       <div className="header-left">
//         <h2>Welcome back, {patientName}!</h2>
//       </div>
//       <div className="header-right">
//         <button className="notification-btn">
//           🔔 <span className="badge">2</span>
//         </button>
//         <img
//           src={`https://ui-avatars.com/api/?name=${patientName}&background=10b981&color=fff`}
//           alt="User"
//           className="user-avatar-small"
//         />
//       </div>
//     </header>
//   );
// }

// // ======== OVERVIEW ========
// function Overview({ appointments, bills }) {
//   const upcomingAppts = appointments.filter(
//     (a) => new Date(a.AppointmentDate) >= new Date()
//   );
//   const nextAppointment = upcomingAppts[0];
//   const totalBills = bills.reduce((sum, b) => sum + (b.Amount || 0), 0);
//   const pendingBills = bills.filter((b) => b.PaymentStatus === "Pending").length;

//   const stats = [
//     { icon: "📅", title: "Upcoming Appointments", value: upcomingAppts.length, color: "#6366f1" },
//     { icon: "👨‍⚕", title: "My Doctors", value: new Set(appointments.map(a => a.DoctorName)).size, color: "#10b981" },
//     { icon: "💳", title: "Pending Bills", value: pendingBills, color: "#f59e0b" },
//     { icon: "📋", title: "Total Visits", value: appointments.length, color: "#3b82f6" },
//   ];

//   return (
//     <div className="overview-container">
//       <h1 className="page-title">Dashboard Overview</h1>

//       <div className="stats-grid">
//         {stats.map((stat, i) => (
//           <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
//             <div className="stat-icon" style={{ background: `${stat.color}15` }}>
//               {stat.icon}
//             </div>
//             <div className="stat-content">
//               <div className="stat-title">{stat.title}</div>
//               <div className="stat-value">{stat.value}</div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {nextAppointment && (
//         <div className="next-appointment-card">
//           <div className="appointment-badge">Next Appointment</div>
//           <div className="appointment-details-large">
//             <div className="appointment-date-large">
//               <span className="day">{new Date(nextAppointment.AppointmentDate).getDate()}</span>
//               <span className="month">
//                 {new Date(nextAppointment.AppointmentDate).toLocaleDateString("en", {
//                   month: "short",
//                 })}
//               </span>
//             </div>
//             <div className="appointment-info-large">
//               <h3>Dr. {nextAppointment.DoctorName}</h3>
//               <p className="specialization">{nextAppointment.Specialization}</p>
//               <p className="time">
//                 ⏰ {formatTime(nextAppointment.StartTime)} - {formatTime(nextAppointment.EndTime)}
//               </p>
//             </div>
//             <div className="appointment-actions">
//               <button className="btn-reschedule">Reschedule</button>
//               <button className="btn-cancel">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ======== BILLING ========
// function Billing({ bills }) {
//   const totalAmount = bills.reduce((sum, bill) => sum + (bill.Amount || 0), 0);
//   const pendingAmount = bills
//     .filter((b) => b.PaymentStatus === "Pending")
//     .reduce((sum, b) => sum + (b.Amount || 0), 0);

//   return (
//     <div className="billing-container">
//       <h1 className="page-title">💳 Billing & Payments</h1>

//       <div className="billing-stats">
//         <div className="billing-stat-card">
//           <span className="billing-stat-label">Total Amount</span>
//           <span className="billing-stat-value">₹{totalAmount}</span>
//         </div>
//         <div className="billing-stat-card pending">
//           <span className="billing-stat-label">Pending Amount</span>
//           <span className="billing-stat-value">₹{pendingAmount}</span>
//         </div>
//       </div>

//       <div className="card">
//         <div className="card-header">
//           <h2>Billing History</h2>
//         </div>
//         <div className="card-body no-padding">
//           {bills.length === 0 ? (
//             <div className="empty-state">
//               <span className="empty-icon">💳</span>
//               <p>No bills yet</p>
//             </div>
//           ) : (
//             <table className="data-table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Description</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {bills.map((bill, i) => (
//                   <tr key={i}>
//                     <td>{formatDate(bill.DateIssued)}</td>
//                     <td>Medical Services</td>
//                     <td>₹{bill.Amount}</td>
//                     <td>
//                       <span className={`status-badge ${bill.PaymentStatus.toLowerCase()}`}>
//                         {bill.PaymentStatus}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ======== HELPERS ========
// function LoadingSpinner() {
//   return (
//     <div className="loading-container">
//       <div className="spinner"></div>
//       <p>Loading...</p>
//     </div>
//   );
// }

// function formatTime(time) {
//   if (!time) return "N/A";
//   const [h, m] = time.split(":");
//   const hour = parseInt(h);
//   return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
// }

// function formatDate(dateString) {
//   return new Date(dateString).toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// // ======== BOOK APPOINTMENT ========
// function BookAppointment({ doctors, reload }) {
//   const [currentStage, setCurrentStage] = useState(1);
//   const [formData, setFormData] = useState({
//     problem: "",
//     doctorId: "",
//     appointmentDate: "",
//     appointmentTime: "",
//     reason: ""
//   });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   // Sample problems with corresponding specializations
//   const problems = [
//     { id: "chest-pain", name: "Chest Pain", specialization: "Cardiology", icon: "❤️" },
//     { id: "headache", name: "Headache/Migraine", specialization: "Neurology", icon: "🧠" },
//     { id: "joint-pain", name: "Joint Pain", specialization: "Orthopedics", icon: "🦴" },
//     { id: "skin-rash", name: "Skin Rash", specialization: "Dermatology", icon: "🦠" },
//     { id: "child-fever", name: "Child Fever", specialization: "Pediatrics", icon: "👶" },
//     { id: "general-checkup", name: "General Checkup", specialization: "General", icon: "🩺" },
//     { id: "back-pain", name: "Back Pain", specialization: "Orthopedics", icon: "🦴" },
//     { id: "heart-palpitations", name: "Heart Palpitations", specialization: "Cardiology", icon: "❤️" },
//     { id: "memory-issues", name: "Memory Issues", specialization: "Neurology", icon: "🧠" },
//     { id: "acne", name: "Acne/Skin Issues", specialization: "Dermatology", icon: "🦠" }
//   ];

//   // Get doctors based on selected problem
//   const getFilteredDoctors = () => {
//     if (!formData.problem) return [];
//     const selectedProblem = problems.find(p => p.id === formData.problem);
//     return doctors.filter(doctor => doctor.specialization === selectedProblem.specialization);
//   };

//   const handleProblemSelect = (problemId) => {
//     setFormData({
//       ...formData,
//       problem: problemId,
//       doctorId: "" // Reset doctor selection when problem changes
//     });
//     setCurrentStage(2);
//   };

//   const handleDoctorSelect = (doctorName) => {
//     // Find the doctor object to get the ID
//     const selectedDoctor = doctors.find(doctor => doctor.name === doctorName);
//     setFormData({
//       ...formData,
//       doctorId: selectedDoctor ? selectedDoctor.id : doctorName
//     });
//     setCurrentStage(3);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       // Convert appointmentTime to startTime and endTime
//       const startTime = formData.appointmentTime;
//       const endTime = formData.appointmentTime.split(':').map((part, index) => {
//         if (index === 0) {
//           const hour = parseInt(part) + 1;
//           return hour.toString().padStart(2, '0');
//         }
//         return part;
//       }).join(':');
      
//       await api.post("/appointments/book", {
//         doctorId: formData.doctorId,
//         appointmentDate: formData.appointmentDate,
//         startTime: startTime,
//         endTime: endTime,
//         reason: formData.reason
//       });
      
//       setSuccess(true);
//       setFormData({ problem: "", doctorId: "", appointmentDate: "", appointmentTime: "", reason: "" });
//       setCurrentStage(1);
//       reload();
      
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       console.error("Error booking appointment:", error);
//       alert("Failed to book appointment. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const goBack = () => {
//     if (currentStage > 1) {
//       setCurrentStage(currentStage - 1);
//     }
//   };

//   return (
//     <div className="book-appointment-container">
//       <h1 className="page-title">📅 Book New Appointment</h1>
      
//       {success && (
//         <div className="success-alert">
//           <span className="success-icon">✅</span>
//           <span>Appointment booked successfully!</span>
//         </div>
//       )}

//       {/* Progress Indicator */}
//       <div className="progress-indicator">
//         <div className={`progress-step ${currentStage >= 1 ? 'active' : ''}`}>
//           <span className="step-number">1</span>
//           <span className="step-label">Select Problem</span>
//         </div>
//         <div className={`progress-step ${currentStage >= 2 ? 'active' : ''}`}>
//           <span className="step-number">2</span>
//           <span className="step-label">Choose Doctor</span>
//         </div>
//         <div className={`progress-step ${currentStage >= 3 ? 'active' : ''}`}>
//           <span className="step-number">3</span>
//           <span className="step-label">Schedule</span>
//         </div>
//       </div>

//       <div className="booking-form-card">
//         {/* Stage 1: Select Problem */}
//         {currentStage === 1 && (
//           <div className="stage-container">
//             <h2>What's your main concern?</h2>
//             <p className="stage-description">Select the problem that best describes your symptoms</p>
            
//             <div className="problems-grid">
//               {problems.map(problem => (
//                 <button
//                   key={problem.id}
//                   className="problem-card"
//                   onClick={() => handleProblemSelect(problem.id)}
//                 >
//                   <span className="problem-icon">{problem.icon}</span>
//                   <span className="problem-name">{problem.name}</span>
//                   <span className="problem-specialization">{problem.specialization}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Stage 2: Select Doctor */}
//         {currentStage === 2 && (
//           <div className="stage-container">
//             <div className="stage-header">
//               <button className="back-btn" onClick={goBack}>← Back</button>
//               <h2>Choose Your Doctor</h2>
//             </div>
//             <p className="stage-description">
//               Select from our specialists in {problems.find(p => p.id === formData.problem)?.specialization}
//             </p>
            
//             <div className="doctors-selection">
//               {getFilteredDoctors().map(doctor => (
//                 <button
//                   key={doctor.name}
//                   className={`doctor-selection-card ${formData.doctorId === doctor.name ? 'selected' : ''}`}
//                   onClick={() => handleDoctorSelect(doctor.name)}
//                 >
//                   <div className="doctor-avatar-small">
//                     {doctor.name.split(' ').map(n => n[0]).join('')}
//                   </div>
//                   <div className="doctor-info-small">
//                     <h3>{doctor.name}</h3>
//                     <p>{doctor.specialization}</p>
//                     <p className="doctor-contact">📞 {doctor.contact}</p>
//                   </div>
//                 </button>
//               ))}
//             </div>
            
//             {getFilteredDoctors().length === 0 && (
//               <div className="no-doctors">
//                 <p>No doctors available for this specialization. Please try a different problem.</p>
//                 <button className="btn-secondary" onClick={() => setCurrentStage(1)}>
//                   Choose Different Problem
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Stage 3: Schedule Appointment */}
//         {currentStage === 3 && (
//           <div className="stage-container">
//             <div className="stage-header">
//               <button className="back-btn" onClick={goBack}>← Back</button>
//               <h2>Schedule Your Appointment</h2>
//             </div>
            
//             <div className="selected-doctor-info">
//               <h3>Selected Doctor: {doctors.find(d => d.id === formData.doctorId)?.name || formData.doctorId}</h3>
//               <p>Specialization: {problems.find(p => p.id === formData.problem)?.specialization}</p>
//             </div>

//             <form onSubmit={handleSubmit} className="booking-form">
//               <div className="form-row">
//                 <div className="form-group">
//                   <label htmlFor="appointmentDate">Appointment Date</label>
//                   <input
//                     type="date"
//                     id="appointmentDate"
//                     name="appointmentDate"
//                     value={formData.appointmentDate}
//                     onChange={handleChange}
//                     min={new Date().toISOString().split('T')[0]}
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label htmlFor="appointmentTime">Appointment Time</label>
//                   <select
//                     id="appointmentTime"
//                     name="appointmentTime"
//                     value={formData.appointmentTime}
//                     onChange={handleChange}
//                     required
//                   >
//                     <option value="">Select time</option>
//                     <option value="09:00">9:00 AM</option>
//                     <option value="10:00">10:00 AM</option>
//                     <option value="11:00">11:00 AM</option>
//                     <option value="12:00">12:00 PM</option>
//                     <option value="14:00">2:00 PM</option>
//                     <option value="15:00">3:00 PM</option>
//                     <option value="16:00">4:00 PM</option>
//                     <option value="17:00">5:00 PM</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="form-group">
//                 <label htmlFor="reason">Additional Notes (Optional)</label>
//                 <textarea
//                   id="reason"
//                   name="reason"
//                   value={formData.reason}
//                   onChange={handleChange}
//                   placeholder="Any additional information about your symptoms or concerns"
//                   rows="3"
//                 />
//               </div>

//               <button type="submit" className="book-appointment-btn" disabled={loading}>
//                 {loading ? "Booking..." : "Confirm Appointment"}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
