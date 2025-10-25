const appointmentModel = require("../models/appointmentModel");

exports.book = (patientId, body, cb) => {
  const { doctorId, appointmentDate, startTime, endTime, reason } = body;
  if (!doctorId || !appointmentDate || !startTime || !endTime) return cb({ status: 400, message: "Missing fields" });

  appointmentModel.findOverlap(doctorId, appointmentDate, startTime, endTime, (err, rows) => {
    if (err) return cb({ status: 500, message: err.message });
    if (rows.length) return cb({ status: 400, message: "Doctor busy in this slot" });

    appointmentModel.create({
      PatientID: patientId,
      DoctorID: doctorId,
      AppointmentDate: appointmentDate,
      StartTime: startTime,
      EndTime: endTime,
      Reason: reason || null,
    }, (err2) => {
      if (err2) return cb({ status: 500, message: err2.message });
      cb(null, { message: "Appointment confirmed" });
    });
  });
};

exports.listForDoctor = (doctorId, cb) => {
  appointmentModel.listForDoctor(doctorId, (err, rows) => {
    if (err) return cb({ status: 500, message: err.message });
    cb(null, rows);
  });
};

exports.listForPatient = (patientId, cb) => {
  appointmentModel.listForPatient(patientId, (err, rows) => {
    if (err) return cb({ status: 500, message: err.message });
    cb(null, rows);
  });
};
