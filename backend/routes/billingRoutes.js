// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const auth = require("../middleware/auth");

// // Doctor or Admin generates a bill for a patient
// router.post("/generate", auth(["doctor","admin"]), (req, res) => {
//   const { patientId, amount } = req.body;
//   if (!patientId || !amount) return res.status(400).json({ message: "Missing fields" });

//   const sql = `INSERT INTO Billing (PatientID, Amount, DateIssued, PaymentStatus)
//                VALUES (?, ?, CURDATE(), 'Pending')`;
//   db.query(sql, [patientId, amount], (err) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json({ message: "Bill generated" });
//   });
// });

// // Patient views their own bills
// router.get("/my", auth(["patient"]), (req, res) => {
//   const patientId = req.user.id;
//   db.query(
//     `SELECT * FROM Billing WHERE PatientID=? ORDER BY DateIssued DESC`,
//     [patientId],
//     (err, rows) => {
//       if (err) return res.status(500).json({ message: err.message });
//       res.json(rows);
//     }
//   );
// });

// module.exports = router;
