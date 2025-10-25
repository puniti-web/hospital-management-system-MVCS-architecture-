import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Doctor.css";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("dashboard");
  const [appointments, setAppointments] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorName, setDoctorName] = useState("Doctor");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const name = localStorage.getItem("userName") || "Doctor";
    setDoctorName(name);

    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, wardsRes] = await Promise.all([
        api.get("/appointments/doctor/my"),
        api.get("/wards"),
      ]);
      setAppointments(appointmentsRes.data);
      setWards(wardsRes.data);
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
    <div className="doctor-layout">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        logout={logout}
        doctorName={doctorName}
      />

      <main className="main-content">
        <TopHeader doctorName={doctorName} />

        <div className="content-wrapper">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {currentView === "dashboard" && (
                <Overview appointments={appointments} wards={wards} />
              )}
              {currentView === "patients" && (
                <Patients appointments={appointments} />
              )}
              {currentView === "appointments" && (
                <Appointments appointments={appointments} reload={loadData} />
              )}
              {currentView === "wards" && <Wards wards={wards} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ========== SIDEBAR ==========
function Sidebar({ currentView, setCurrentView, logout, doctorName }) {
  const menuItems = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "patients", icon: "👥", label: "Patients" },
    { id: "appointments", icon: "📅", label: "Appointments" },
    { id: "wards", icon: "🏥", label: "Wards" },
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
          <div className="user-avatar">
            {doctorName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <div className="user-name">{doctorName}</div>
            <div className="user-role">Doctor</div>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ========== HEADER ==========
function TopHeader({ doctorName }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <h2>Good Morning, {doctorName}!</h2>
      </div>
      <div className="header-right">
        <button className="notification-btn">
          🔔
          <span className="badge">3</span>
        </button>
        <img
          src={`https://ui-avatars.com/api/?name=${doctorName}&background=6366f1&color=fff`}
          alt="User"
          className="user-avatar-small"
        />
      </div>
    </header>
  );
}

// ========== OVERVIEW ==========
function Overview({ appointments, wards }) {
  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) =>
    a.AppointmentDate?.startsWith(today)
  );
  const totalPatients = new Set(appointments.map((a) => a.PatientName)).size;
  const confirmedToday = todayAppts.filter((a) => a.Status === "Confirmed").length;

  const stats = [
    { icon: "📅", title: "Today's Appointments", value: todayAppts.length, color: "#6366f1" },
    { icon: "👥", title: "Total Patients", value: totalPatients, color: "#10b981" },
    { icon: "✅", title: "Confirmed Today", value: confirmedToday, color: "#3b82f6" },
    { icon: "🏥", title: "Active Wards", value: wards.length, color: "#f59e0b" },
  ];

  return (
    <div className="overview-container">
      <h1 className="page-title">Dashboard Overview</h1>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ background: `${stat.color}15` }}>
              <span>{stat.icon}</span>
            </div>
            <div className="stat-content">
              <div className="stat-title">{stat.title}</div>
              <div className="stat-value">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2>📋 Today's Schedule</h2>
          <span className="badge-count">{todayAppts.length} appointments</span>
        </div>
        <div className="card-body">
          {todayAppts.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <p>No appointments scheduled for today</p>
            </div>
          ) : (
            <div className="schedule-list">
              {todayAppts.map((apt) => (
                <div key={apt.AppointmentID} className="schedule-item">
                  <div className="schedule-time">
                    <span className="time">{formatTime(apt.StartTime)}</span>
                    <span className="duration">30 min</span>
                  </div>
                  <div className="schedule-details">
                    <div className="patient-name">{apt.PatientName}</div>
                    <div className="appointment-reason">{apt.Reason || "General Checkup"}</div>
                  </div>
                  <div className={`status-badge ${apt.Status.toLowerCase()}`}>
                    {apt.Status}
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

// ========== PATIENTS ==========
function Patients({ appointments }) {
  const [searchTerm, setSearchTerm] = useState("");

  const patientMap = {};
  appointments.forEach((apt) => {
    if (!patientMap[apt.PatientName]) {
      patientMap[apt.PatientName] = {
        name: apt.PatientName,
        visits: 0,
        lastVisit: apt.AppointmentDate,
      };
    }
    patientMap[apt.PatientName].visits++;
  });

  const patients = Object.values(patientMap).filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients-container">
      <div className="page-header">
        <h1 className="page-title">👥 My Patients</h1>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Patient List</h2>
          <span className="badge-count">{patients.length} patients</span>
        </div>
        <div className="card-body no-padding">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Total Visits</th>
                <th>Last Visit</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient, i) => (
                <tr key={i}>
                  <td>{patient.name}</td>
                  <td>{patient.visits}</td>
                  <td>{formatDate(patient.lastVisit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========== APPOINTMENTS ==========
function Appointments({ appointments, reload }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === "all" || a.Status.toLowerCase() === filter;
    const matchesSearch = a.PatientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1 className="page-title">📅 Appointments</h1>
        <button className="primary-btn" onClick={reload}>
          🔄 Refresh
        </button>
      </div>

      <div className="filters-bar">
        <div className="filter-tabs">
          {["all", "confirmed", "pending", "completed"].map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body no-padding">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Patient</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.AppointmentID}>
                  <td>{formatDate(apt.AppointmentDate)}</td>
                  <td>
                    {formatTime(apt.StartTime)} - {formatTime(apt.EndTime)}
                  </td>
                  <td>{apt.PatientName}</td>
                  <td>{apt.Reason || "General Checkup"}</td>
                  <td>
                    <span className={`status-badge ${apt.Status.toLowerCase()}`}>
                      {apt.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ========== WARDS ==========
function Wards({ wards }) {
  return (
    <div className="wards-container">
      <h1 className="page-title">🏥 Ward Management</h1>

      <div className="wards-grid">
        {wards.map((ward) => {
          const occupancy = ward.AssignedDoctor ? 70 : 0;
          const color =
            occupancy > 80 ? "#ef4444" : occupancy > 50 ? "#f59e0b" : "#10b981";

          return (
            <div
              key={ward.WardID}
              className="ward-card"
              style={{ borderLeftColor: color }}
            >
              <div className="ward-header">
                <h3>{ward.WardName}</h3>
                <span className="ward-icon">🏥</span>
              </div>
              <div className="ward-info">
                <div className="info-row">
                  <span className="info-label">Capacity:</span>
                  <span className="info-value">{ward.Capacity} beds</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Occupancy:</span>
                  <span className="info-value" style={{ color }}>
                    {occupancy}%
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Status:</span>
                  <span
                    className={`status-badge ${
                      ward.AssignedDoctor ? "active" : "available"
                    }`}
                  >
                    {ward.AssignedDoctor ? "Assigned" : "Available"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ========== HELPERS ==========
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
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
