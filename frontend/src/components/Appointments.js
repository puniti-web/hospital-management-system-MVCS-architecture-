import React, { useState } from "react";
import api from "../api";

export default function Appointments({ appointments = [], doctors = [], reload }) {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = appointments.filter((a) => {
    const matchesFilter = filter === "all" || (a.Status?.toLowerCase() || "").includes(filter);
    const matchesSearch = 
      (a.DoctorName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (a.Reason?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatTime = (time) => {
    if (!time) return "N/A";
    const [h, m] = time.split(":");
    const hour = parseInt(h, 10);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="appointments-container">
      <div className="page-header">
        <h1 className="page-title">📅 My Appointments</h1>
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
        <div className="card-header">
          <h2>Appointment List</h2>
          <span className="badge-count">{filtered.length} appointments</span>
        </div>
        <div className="card-body no-padding">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    <span className="empty-icon">📅</span>
                    <p>No appointments found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.AppointmentID}>
                    <td>{formatDate(apt.AppointmentDate)}</td>
                    <td>
                      {formatTime(apt.StartTime)} - {formatTime(apt.EndTime)}
                    </td>
                    <td>Dr. {apt.DoctorName || "N/A"}</td>
                    <td>{apt.Specialization || "N/A"}</td>
                    <td>{apt.Reason || "General Checkup"}</td>
                    <td>
                      <span className={`status-badge ${(apt.Status?.toLowerCase() || "")}`}>
                        {apt.Status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
