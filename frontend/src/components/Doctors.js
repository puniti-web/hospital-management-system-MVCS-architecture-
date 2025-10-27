import React from "react";

export default function Doctors({ doctors = [] }) {
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

  // Get unique doctors that the patient has appointments with
  const myDoctors = Array.from(
    new Map(
      doctors.map(d => [d.id, d])
    ).values()
  );

  return (
    <div className="doctors-container">
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
                      <p>📞 {doctor.contact || "N/A"}</p>
                      <p>✉️ {doctor.email || "N/A"}</p>
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
