const db = require("../config/db");

exports.create = (patient, cb) => {
  const sql = `INSERT INTO Patient (Name, Age, Gender, Contact, Address, Email, Password) VALUES (?,?,?,?,?,?,?)`;
  db.query(
    sql,
    [
      patient.Name,
      patient.Age || null,
      patient.Gender || null,
      patient.Contact || null,
      patient.Address || null,
      patient.Email,
      patient.Password
    ],
    cb
  );
};

exports.findByEmailOrContact = (emailOrContact, cb) => {
  const sql = `SELECT * FROM Patient WHERE Email=? OR Contact=? LIMIT 1`;
  db.query(sql, [emailOrContact, emailOrContact], cb);
};
