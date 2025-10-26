// const db = require("../config/db");

// exports.findOverlap = (doctorId, appointmentDate, startTime, endTime, cb) => {
//   const sql = `
//     SELECT 1 FROM Appointment
//     WHERE DoctorID=? AND AppointmentDate=?
//       AND ((StartTime < ? AND EndTime > ?) OR (StartTime >= ? AND StartTime < ?))
//     LIMIT 1`;
//   db.query(sql, [doctorId, appointmentDate, endTime, startTime, startTime, endTime], cb);
// };

// exports.create = (row, cb) => {
//   const sql = `INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status)
//                VALUES (?,?,?,?,?,?,'Confirmed')`;
//   db.query(sql, [row.PatientID, row.DoctorID, row.AppointmentDate, row.StartTime, row.EndTime, row.Reason || null], cb);
// };

// exports.listForDoctor = (doctorId, cb) => {
//   const sql = `
//     SELECT a.*, p.Name AS PatientName
//     FROM Appointment a JOIN Patient p ON p.PatientID=a.PatientID
//     WHERE a.DoctorID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
//   db.query(sql, [doctorId], cb);
// };

// exports.listForPatient = (patientId, cb) => {
//   const sql = `
//     SELECT a.*, d.Name AS DoctorName, d.Specialization
//     FROM Appointment a JOIN Doctor d ON d.DoctorID=a.DoctorID
//     WHERE a.PatientID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
//   db.query(sql, [patientId], cb);
// };


const db = require('../config/db');

const appointmentModel = {
  // Check for overlaps for same doctor, same date
  findOverlap: ({ DoctorID, AppointmentDate, StartTime, EndTime }) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT AppointmentID
        FROM Appointment
        WHERE DoctorID = ?
          AND AppointmentDate = ?
          AND (
            (StartTime < ? AND EndTime > ?)   -- existing starts before new end AND ends after new start
            OR
            (StartTime >= ? AND StartTime < ?) -- existing starts within new window
          )`;
      const params = [
        DoctorID, AppointmentDate,
        EndTime, StartTime,
        StartTime, EndTime
      ];
      db.query(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    }),

  create: ({ PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status }) =>
    new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Appointment
          (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const params = [PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason || null, Status || 'Scheduled'];
      db.query(sql, params, (err, result) => err ? reject(err) : resolve(result.insertId));
    }),

  listForDoctor: (DoctorID) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT a.*, p.Name AS PatientName
        FROM Appointment a
        JOIN Patient p ON p.PatientID = a.PatientID
        WHERE a.DoctorID = ?
        ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
      db.query(sql, [DoctorID], (err, rows) => err ? reject(err) : resolve(rows));
    }),

  listForPatient: (PatientID) =>
    new Promise((resolve, reject) => {
      const sql = `
        SELECT a.*, d.Name AS DoctorName, d.Specialization
        FROM Appointment a
        JOIN Doctor d ON d.DoctorID = a.DoctorID
        WHERE a.PatientID = ?
        ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
      db.query(sql, [PatientID], (err, rows) => err ? reject(err) : resolve(rows));
    }),
};

module.exports = appointmentModel;
