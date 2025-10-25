// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const db = require("../db");

// // helper for token
// function signToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "2h" });
// }

// // ---- Register Patient ----
// router.post("/register/patient", async (req, res) => {
//   try {
//     const { Name, Age, Gender, Contact, Address, Email, Password } = req.body;
//     if (!Name || !Email || !Password) return res.status(400).json({ message: "Missing fields" });
//     const hash = bcrypt.hashSync(Password, 10);
//     const sql = `INSERT INTO Patient (Name, Age, Gender, Contact, Address, Email, Password)
//                  VALUES (?,?,?,?,?,?,?)`;
//     db.query(sql, [Name, Age||null, Gender||null, Contact||null, Address||null, Email, hash], (err, result) => {
//       if (err) return res.status(500).json({ message: err.message });
//       const token = signToken({ id: result.insertId, role: "patient" });
//       res.json({ token, role: "patient", id: result.insertId });
//     });
//   } catch (e) { res.status(500).json({ message: e.message }); }
// });

// // ---- Register Doctor (admin can do later; for demo allow public) ----
// router.post("/register/doctor", (req, res) => {
//   const { Name, Specialization, Contact, Email, Password } = req.body;
//   if (!Name || !Email || !Password) return res.status(400).json({ message: "Missing fields" });
//   const hash = bcrypt.hashSync(Password, 10);
//   const sql = `INSERT INTO Doctor (Name, Specialization, Contact, Email, Password)
//                VALUES (?,?,?,?,?)`;
//   db.query(sql, [Name, Specialization||null, Contact||null, Email, hash], (err, result) => {
//     if (err) return res.status(500).json({ message: err.message });
//     const token = signToken({ id: result.insertId, role: "doctor" });
//     res.json({ token, role: "doctor", id: result.insertId });
//   });
// });

// // ---- Login (role-aware) ----
// router.post("/login", (req, res) => {
//   const { role, emailOrContact, password } = req.body;
//   if (!role || !emailOrContact || !password) return res.status(400).json({ message: "Missing fields" });

//   const table = role === "doctor" ? "Doctor" : role === "admin" ? "Doctor" : "Patient";
//   const idCol = role === "doctor" || role === "admin" ? "DoctorID" : "PatientID";

//   const sql = `SELECT * FROM ${table} WHERE Email = ? OR Contact = ? LIMIT 1`;
//   db.query(sql, [emailOrContact, emailOrContact], async (err, rows) => {
//     if (err) return res.status(500).json({ message: err.message });
//     if (!rows.length) return res.status(404).json({ message: "User not found" });

//     const user = rows[0];
//     const ok = await bcrypt.compare(password, user.Password || "");
//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     // simple: treat admin as a doctor with role=admin if email matches (optional)
//     const effectiveRole = role;

//     const token = signToken({ id: user[idCol], role: effectiveRole });
//     res.json({ token, role: effectiveRole, id: user[idCol], name: user.Name });
//   });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/authController");

router.post("/register/patient", ctrl.registerPatient);
router.post("/register/doctor", ctrl.registerDoctor);
router.post("/login", ctrl.login);

module.exports = router;
