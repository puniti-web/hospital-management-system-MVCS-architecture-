const db = require("../config/db");

exports.listAll = (cb) => db.query(`SELECT * FROM Ward`, cb);

exports.assignPatient = (wardId, patientId, cb) => {
  const sql = `UPDATE Ward SET AssignedPatientID=? WHERE WardID=?`;
  db.query(sql, [patientId, wardId], cb);
};
