const db = require("../config/db");

exports.create = (doctor, cb) => {
  const sql = `INSERT INTO Doctor (Name, Specialization, Contact, Email, Password) VALUES (?,?,?,?,?)`;
  db.query(sql, [doctor.Name, doctor.Specialization || null, doctor.Contact || null, doctor.Email, doctor.Password], cb);
};

exports.findByEmailOrContact = (emailOrContact, cb) => {
  const sql = `SELECT * FROM Doctor WHERE Email=? OR Contact=? LIMIT 1`;
  db.query(sql, [emailOrContact, emailOrContact], cb);
};

exports.findAll = (cb) => {
  const sql = `SELECT * FROM Doctor ORDER BY Name`;
  db.query(sql, cb);
};