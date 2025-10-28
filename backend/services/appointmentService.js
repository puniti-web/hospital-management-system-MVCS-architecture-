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
    const doctorClashes = await appointmentModel.findOverlap({ DoctorID, AppointmentDate, StartTime, EndTime });
    if (doctorClashes.length > 0) {
      return { success: false, message: 'Selected slot overlaps with an existing appointment.' };
    }
    // Prevent patient double-booking in same time window
    const patientClashes = await appointmentModel.findOverlapForPatient({ PatientID, AppointmentDate, StartTime, EndTime });
    if (patientClashes.length > 0) {
      return { success: false, message: 'You already have an appointment in this time window.' };
    }
    const id = await appointmentModel.create({ PatientID, DoctorID, AppointmentDate, StartTime, EndTime, Reason, Status });
    return { success: true, id };
  },

  myForPatient: async (PatientID) => await appointmentModel.listForPatient(PatientID),
  myForDoctor: async (DoctorID) => await appointmentModel.listForDoctor(DoctorID),

  // Doctor rejects appointment (only their own)
  doctorReject: async ({ AppointmentID, DoctorID }) => {
    const appt = await appointmentModel.getById(AppointmentID);
    if (!appt) return { success: false, status: 404, message: 'Appointment not found' };
    if (appt.DoctorID !== Number(DoctorID)) return { success: false, status: 403, message: 'Not your appointment' };
    if (appt.Status === 'Rejected') return { success: true, message: 'Already rejected' };
    await appointmentModel.updateStatus({ AppointmentID, Status: 'Rejected' });
    return { success: true };
  },
};

module.exports = appointmentService;
