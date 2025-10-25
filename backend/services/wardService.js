const wardModel = require("../models/wardModel");

exports.listAll = (cb) => wardModel.listAll((err, rows) => {
  if (err) return cb({ status: 500, message: err.message });
  cb(null, rows);
});

exports.assign = (wardId, patientId, cb) => {
  if (!wardId || !patientId) return cb({ status: 400, message: "Missing fields" });
  wardModel.assignPatient(wardId, patientId, (err) => {
    if (err) return cb({ status: 500, message: err.message });
    cb(null, { message: "Patient assigned to ward" });
  });
};
