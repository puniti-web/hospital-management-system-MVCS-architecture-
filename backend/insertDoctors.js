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

// Sample doctors data
const doctors = [
  { name: "Dr. Sarah Johnson", specialization: "Cardiology", contact: "9876543210", email: "sarah.johnson@hospital.com", password: "password123" },
  { name: "Dr. Michael Chen", specialization: "Neurology", contact: "9876543211", email: "michael.chen@hospital.com", password: "password123" },
  { name: "Dr. Emily Rodriguez", specialization: "Orthopedics", contact: "9876543212", email: "emily.rodriguez@hospital.com", password: "password123" },
  { name: "Dr. James Wilson", specialization: "Dermatology", contact: "9876543213", email: "james.wilson@hospital.com", password: "password123" },
  { name: "Dr. Priya Sharma", specialization: "Pediatrics", contact: "9876543214", email: "priya.sharma@hospital.com", password: "password123" },
  { name: "Dr. Robert Brown", specialization: "General", contact: "9876543215", email: "robert.brown@hospital.com", password: "password123" },
  { name: "Dr. Lisa Anderson", specialization: "Cardiology", contact: "9876543216", email: "lisa.anderson@hospital.com", password: "password123" },
  { name: "Dr. David Kumar", specialization: "Neurology", contact: "9876543217", email: "david.kumar@hospital.com", password: "password123" },
  { name: "Dr. Maria Garcia", specialization: "Orthopedics", contact: "9876543218", email: "maria.garcia@hospital.com", password: "password123" },
  { name: "Dr. John Smith", specialization: "General", contact: "9876543219", email: "john.smith@hospital.com", password: "password123" }
];

// Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL Database");
  
  // Insert doctors
  insertDoctors();
});

function insertDoctors() {
  console.log("🔄 Inserting doctors...");
  
  const sql = `INSERT INTO Doctor (Name, Specialization, Contact, Email, Password) VALUES (?, ?, ?, ?, ?)`;
  
  let completed = 0;
  let errors = 0;
  
  doctors.forEach((doctor, index) => {
    db.query(sql, [doctor.name, doctor.specialization, doctor.contact, doctor.email, doctor.password], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Doctor ${doctor.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error inserting ${doctor.name}:`, err.message);
          errors++;
        }
      } else {
        console.log(`✅ Inserted: ${doctor.name} (${doctor.specialization})`);
      }
      
      completed++;
      if (completed === doctors.length) {
        console.log(`\n📊 Summary: ${completed - errors} doctors inserted, ${errors} errors`);
        db.end();
      }
    });
  });
}
