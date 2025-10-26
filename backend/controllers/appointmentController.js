// import db from '../db.js';

// export const bookAppointment = (req, res) => {
//   const { patientId, doctorId, appointmentDate, startTime, endTime, reason } = req.body;

//   // check overlapping
//   const checkQuery = `
//     SELECT * FROM Appointment
//     WHERE DoctorID = ? AND AppointmentDate = ?
//     AND ((StartTime < ? AND EndTime > ?) OR (StartTime >= ? AND StartTime < ?))
//   `;

//   db.query(
//     checkQuery,
//     [doctorId, appointmentDate, endTime, startTime, startTime, endTime],
//     (err, result) => {
//       if (err) return res.status(500).json({ message: 'DB error' });
//       if (result.length > 0)
//         return res.status(400).json({ message: 'Doctor is busy in this slot' });

//       const insertQuery = `
//         INSERT INTO Appointment (PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status)
//         VALUES (?, ?, ?, ?, ?, ?, 'Confirmed')
//       `;

//       db.query(
//         insertQuery,
//         [patientId, doctorId, appointmentDate, startTime, endTime, reason],
//         err2 => {
//           if (err2) return res.status(500).json({ message: 'Insert error' });
//           res.json({ message: 'Appointment booked successfully!' });
//         }
//       );
//     }
//   );
// };

// export const getAppointments = (req, res) => {
//   const { doctorId } = req.params;
//   db.query('SELECT * FROM Appointment WHERE DoctorID = ?', [doctorId], (err, data) => {
//     if (err) return res.status(500).json({ message: 'Error' });
//     res.json(data);
//   });
// };
const appointmentService = require('../services/appointmentService');

exports.book = async (req, res) => {
  try {
    // req.user is set by auth middleware; PatientID comes from token
    const patientIdFromToken = req.user?.id;
    if (!patientIdFromToken) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { doctorId, appointmentDate, startTime, endTime, reason } = req.body;

    const result = await appointmentService.book({
      PatientID: patientIdFromToken,
      DoctorID: Number(doctorId),
      AppointmentDate: appointmentDate,       // 'YYYY-MM-DD'
      StartTime: startTime,                   // 'HH:MM:SS'
      EndTime: endTime,                       // 'HH:MM:SS'
      Reason: reason || null,
    });

    if (!result.success) return res.status(409).json(result);
    res.json({ success: true, id: result.id });
  } catch (e) {
    console.error('book:', e);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
};


exports.doctorMy = (req, res) => {
  appointmentService.listForDoctor(req.user.id, (err, rows) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(rows);
  });
};

exports.patientMy = (req, res) => {
  appointmentService.listForPatient(req.user.id, (err, rows) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(rows);
  });
};
