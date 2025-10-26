// const appointmentModel = require("../models/appointmentModel");

// exports.book = (patientId, body, cb) => {
//   const { doctorId, appointmentDate, startTime, endTime, reason } = body;
//   if (!doctorId || !appointmentDate || !startTime || !endTime) return cb({ status: 400, message: "Missing fields" });

//   appointmentModel.findOverlap(doctorId, appointmentDate, startTime, endTime, (err, rows) => {
//     if (err) return cb({ status: 500, message: err.message });
//     if (rows.length) return cb({ status: 400, message: "Doctor busy in this slot" });

//     appointmentModel.create({
//       PatientID: patientId,
//       DoctorID: doctorId,
//       AppointmentDate: appointmentDate,
//       StartTime: startTime,
//       EndTime: endTime,
//       Reason: reason || null,
//     }, (err2) => {
//       if (err2) return cb({ status: 500, message: err2.message });
//       cb(null, { message: "Appointment confirmed" });
//     });
//   });
// };

// exports.listForDoctor = (doctorId, cb) => {
//   appointmentModel.listForDoctor(doctorId, (err, rows) => {
//     if (err) return cb({ status: 500, message: err.message });
//     cb(null, rows);
//   });
// };

// exports.listForPatient = (patientId, cb) => {
//   appointmentModel.listForPatient(patientId, (err, rows) => {
//     if (err) return cb({ status: 500, message: err.message });
//     cb(null, rows);
//   });
// };

const appointmentModel = require('../models/appointmentModel');

const appointmentService = {
  book: async ({ PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status }) => {
    // Overlap guard
    const clashes = await appointmentModel.findOverlap({ DoctorID, AppointmentDate, StartTime, EndTime });
    if (clashes.length > 0) {
      return { success: false, message: 'Selected slot overlaps with an existing appointment.' };
    }
    const id = await appointmentModel.create({ PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status });
    return { success: true, id };
  },

  myForPatient: async (PatientID) => await appointmentModel.listForPatient(PatientID),
  myForDoctor: async (DoctorID) => await appointmentModel.listForDoctor(DoctorID),
};

module.exports = appointmentService;
