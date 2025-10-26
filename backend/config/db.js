// ====== MySQL Database Connection ======
const mysql = require("mysql2");
require("dotenv").config();

console.log("🔍 Environment check:", {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "root",
  DB_PASS: process.env.DB_PASS ? "***" : "NOT SET",
  DB_NAME: process.env.DB_NAME || "hospitaldb"
});

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "hospitaldb",
});

db.connect(err => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("⚠️  Server will continue but database operations will fail");
    console.log("💡 Please check your .env file with correct MySQL credentials");
  } else {
    console.log("✅ Connected to MySQL Database:", process.env.DB_NAME || "hospitaldb");
  }
});

module.exports = db;
