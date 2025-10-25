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
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("Patient");

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Patient";
    setPatientName(name);
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes] = await Promise.all([api.get("/appointments/patient/my")]);
      setAppointments(appointmentsRes.data);

      try {
        const billsRes = await api.get("/billing/my");
        setBills(billsRes.data);
      } catch (err) {
        console.log("Bills not available");
      }

      const uniqueDoctors = [];
      const doctorMap = new Map();
      appointmentsRes.data.forEach((apt) => {
        if (!doctorMap.has(apt.DoctorName)) {
          doctorMap.set(apt.DoctorName, {
            name: apt.DoctorName,
            specialization: apt.Specialization || "General",
            appointments: 1,
          });
          uniqueDoctors.push(doctorMap.get(apt.DoctorName));
        } else {
          doctorMap.get(apt.DoctorName).appointments++;
        }
      });
      setDoctors(uniqueDoctors);
    } catch (error) {
      console.error("Error loading data:", error);
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
              {currentView === "doctors" && <Doctors doctors={doctors} />}
              {currentView === "billing" && <Billing bills={bills} />}
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

// ======== SIDEBAR ========
function Sidebar({ currentView, setCurrentView, logout, patientName }) {
  const menuItems = [
    { id: "dashboard", icon: "🏠", label: "Dashboard" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "doctors", icon: "👨‍⚕", label: "My Doctors" },
    { id: "records", icon: "📋", label: "Medical Records" },
    { id: "billing", icon: "💳", label: "Billing" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">TEAM UTPA</span>
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

// ======== TOP HEADER ========
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

// ======== OVERVIEW ========
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

// ======== BILLING ========
function Billing({ bills }) {
  const totalAmount = bills.reduce((sum, bill) => sum + (bill.Amount || 0), 0);
  const pendingAmount = bills
    .filter((b) => b.PaymentStatus === "Pending")
    .reduce((sum, b) => sum + (b.Amount || 0), 0);

  return (
    <div className="billing-container">
      <h1 className="page-title">💳 Billing & Payments</h1>

      <div className="billing-stats">
        <div className="billing-stat-card">
          <span className="billing-stat-label">Total Amount</span>
          <span className="billing-stat-value">₹{totalAmount}</span>
        </div>
        <div className="billing-stat-card pending">
          <span className="billing-stat-label">Pending Amount</span>
          <span className="billing-stat-value">₹{pendingAmount}</span>
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

// ======== HELPERS ========
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
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
