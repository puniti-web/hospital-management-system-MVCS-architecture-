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
  
  // Create tables if they don't exist
  createTables();
});

function createTables() {
  console.log("🔄 Creating tables...");
  
  // Create Patient table
  const createPatientTable = `
    CREATE TABLE IF NOT EXISTS Patient (
      PatientID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(255) NOT NULL,
      Contact VARCHAR(20),
      Email VARCHAR(255) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create Doctor table
  const createDoctorTable = `
    CREATE TABLE IF NOT EXISTS Doctor (
      ID INT AUTO_INCREMENT PRIMARY KEY,
      Name VARCHAR(255) NOT NULL,
      Specialization VARCHAR(100),
      Contact VARCHAR(20),
      Email VARCHAR(255) UNIQUE NOT NULL,
      Password VARCHAR(255) NOT NULL,
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  // Create Appointment table
  const createAppointmentTable = `
    CREATE TABLE IF NOT EXISTS Appointment (
      AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
      PatientID INT NOT NULL,
      DoctorID INT NOT NULL,
      AppointmentDate DATE NOT NULL,
      StartTime TIME NOT NULL,
      EndTime TIME NOT NULL,
      Reason TEXT,
      Status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE,
      FOREIGN KEY (DoctorID) REFERENCES Doctor(ID) ON DELETE CASCADE
    )
  `;
  
  // Create Billing table
  const createBillingTable = `
    CREATE TABLE IF NOT EXISTS Billing (
      BillID INT AUTO_INCREMENT PRIMARY KEY,
      PatientID INT NOT NULL,
      Amount DECIMAL(10,2) NOT NULL,
      Description TEXT,
      Status ENUM('Pending', 'Paid', 'Overdue') DEFAULT 'Pending',
      CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (PatientID) REFERENCES Patient(PatientID) ON DELETE CASCADE
    )
  `;
  
  const tables = [
    { name: "Patient", sql: createPatientTable },
    { name: "Doctor", sql: createDoctorTable },
    { name: "Appointment", sql: createAppointmentTable },
    { name: "Billing", sql: createBillingTable }
  ];
  
  let completed = 0;
  
  tables.forEach(table => {
    db.query(table.sql, (err) => {
      if (err) {
        console.error(`❌ Error creating ${table.name} table:`, err.message);
      } else {
        console.log(`✅ ${table.name} table ready`);
      }
      
      completed++;
      if (completed === tables.length) {
        console.log("\n📊 Database setup complete!");
        db.end();
      }
    });
  });
}
