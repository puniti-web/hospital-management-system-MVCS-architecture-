const mysql = require("mysql2");
require("dotenv").config();

// Create database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "hospitaldb",
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL Database");
  
  // Create test patient
  createTestPatient();
});

function createTestPatient() {
  console.log("🔄 Creating test patient...");
  
  const sql = `INSERT IGNORE INTO Patient (Name, Contact, Email, Password) VALUES (?, ?, ?, ?)`;
  const patientData = ["Test Patient", "1234567890", "test@patient.com", "password123"];
  
  db.query(sql, patientData, (err, result) => {
    if (err) {
      console.error("❌ Error creating test patient:", err.message);
    } else {
      console.log("✅ Test patient created/verified");
      // Test appointment booking
      testAppointmentBooking();
    }
  });
}

function testAppointmentBooking() {
  console.log("🔄 Testing appointment booking...");
  
  // First, get a patient and doctor ID
  db.query("SELECT PatientID FROM Patient WHERE Email = 'test@patient.com' LIMIT 1", (err, patients) => {
    if (err || patients.length === 0) {
      console.error("❌ No test patient found");
      return;
    }
    
    db.query("SELECT ID FROM Doctor LIMIT 1", (err, doctors) => {
      if (err || doctors.length === 0) {
        console.error("❌ No doctors found");
        return;
      }
      
      const patientId = patients[0].PatientID;
      const doctorId = doctors[0].ID;
      
      // Test appointment booking
      const appointmentData = {
        PatientID: patientId,
        DoctorID: doctorId,
        AppointmentDate: "2025-10-28",
        StartTime: "11:00:00",
        EndTime: "12:00:00",
        Reason: "Test appointment",
        Status: "Pending"
      };
      
      const sql = `INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      
      db.query(sql, [
        appointmentData.PatientID,
        appointmentData.DoctorID,
        appointmentData.AppointmentDate,
        appointmentData.StartTime,
        appointmentData.EndTime,
        appointmentData.Reason,
        appointmentData.Status
      ], (err, result) => {
        if (err) {
          console.error("❌ Error booking appointment:", err.message);
        } else {
          console.log("✅ Test appointment booked successfully!");
          console.log("Appointment ID:", result.insertId);
        }
        
        db.end();
      });
    });
  });
}
