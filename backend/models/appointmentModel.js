const db = require("../config/db");

exports.findOverlap = (doctorId, appointmentDate, startTime, endTime, cb) => {
  const sql = `
    SELECT 1 FROM Appointment
    WHERE DoctorID=? AND AppointmentDate=?
      AND ((StartTime < ? AND EndTime > ?) OR (StartTime >= ? AND StartTime < ?))
    LIMIT 1`;
  db.query(sql, [doctorId, appointmentDate, endTime, startTime, startTime, endTime], cb);
};

exports.create = (row, cb) => {
  const sql = `INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status)
               VALUES (?,?,?,?,?,?,'Confirmed')`;
  db.query(sql, [row.PatientID, row.DoctorID, row.AppointmentDate, row.StartTime, row.EndTime, row.Reason || null], cb);
};

exports.listForDoctor = (doctorId, cb) => {
  const sql = `
    SELECT a.*, p.Name AS PatientName
    FROM Appointment a JOIN Patient p ON p.PatientID=a.PatientID
    WHERE a.DoctorID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
  db.query(sql, [doctorId], cb);
};

exports.listForPatient = (patientId, cb) => {
  const sql = `
    SELECT a.*, d.Name AS DoctorName, d.Specialization
    FROM Appointment a JOIN Doctor d ON d.DoctorID=a.DoctorID
    WHERE a.PatientID=? ORDER BY a.AppointmentDate DESC, a.StartTime DESC`;
  db.query(sql, [patientId], cb);
};
