// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const auth = require("../middleware/auth");

// // helper: overlap
// function overlapQuery() {
//   return `
//     SELECT 1 FROM Appointment
//     WHERE DoctorID = ?
//       AND AppointmentDate = ?
//       AND ((StartTime < ? AND EndTime > ?) OR (StartTime >= ? AND StartTime < ?))
//     LIMIT 1
//   `;
// }

// // Patient books appointment
// router.post("/book", auth(["patient"]), (req, res) => {
//   const { doctorId, appointmentDate, startTime, endTime, reason } = req.body;
//   const patientId = req.user.id;

//   if (!doctorId || !appointmentDate || !startTime || !endTime)
//     return res.status(400).json({ message: "Missing fields" });

//   db.query(overlapQuery(), [doctorId, appointmentDate, endTime, startTime, startTime, endTime], (err, rows) => {
//     if (err) return res.status(500).json({ message: err.message });
//     if (rows.length) return res.status(400).json({ message: "Doctor busy in this slot" });

//     const sql = `INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status)
//                  VALUES (?,?,?,?,?,?,'Confirmed')`;
//     db.query(sql, [patientId, doctorId, appointmentDate, startTime, endTime, reason || null], err2 => {
//       if (err2) return res.status(500).json({ message: err2.message });
//       res.json({ message: "Appointment confirmed" });
//     });
//   });
// });

// // Doctor view their appointments
// router.get("/doctor/my", auth(["doctor", "admin"]), (req, res) => {
//   const doctorId = req.user.id;
//   const sql = `
//     SELECT a.*, p.Name AS PatientName
//     FROM Appointment a JOIN Patient p ON p.PatientID=a.PatientID
//     WHERE a.DoctorID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC
//   `;
//   db.query(sql, [doctorId], (err, rows) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json(rows);
//   });
// });

// // Patient view their appointments
// router.get("/patient/my", auth(["patient"]), (req, res) => {
//   const patientId = req.user.id;
//   const sql = `
//     SELECT a.*, d.Name AS DoctorName, d.Specialization
//     FROM Appointment a JOIN Doctor d ON d.DoctorID=a.DoctorID
//     WHERE a.PatientID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC
//   `;
//   db.query(sql, [patientId], (err, rows) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json(rows);
//   });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/appointmentController");

router.post("/book", auth(["patient"]), ctrl.book);
router.get("/doctor/my", auth(["doctor"]), ctrl.doctorMy);
router.get("/patient/my", auth(["patient"]), ctrl.patientMy);
// Doctor rejects an appointment by id
router.post("/:id/reject", auth(["doctor"]), ctrl.reject);

// Test endpoint (remove in production)
router.post("/test-book", (req, res) => {
  const appointmentService = require("../services/appointmentService");
  appointmentService.book(1, req.body, (err, result) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(result);
  });
});

module.exports = router;
