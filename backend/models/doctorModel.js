// const db = require("../config/db");

// exports.create = (doctor, cb) => {
//   const sql = `INSERT INTO Doctor (Name, Specialization, Contact, Email, Password) VALUES (?,?,?,?,?)`;
//   db.query(sql, [doctor.Name, doctor.Specialization || null, doctor.Contact || null, doctor.Email, doctor.Password], cb);
// };

// exports.findByEmailOrContact = (emailOrContact, cb) => {
//   const sql = `SELECT * FROM Doctor WHERE Email=? OR Contact=? LIMIT 1`;
//   db.query(sql, [emailOrContact, emailOrContact], cb);
// };

// exports.findAll = (cb) => {
//   const sql = `SELECT * FROM Doctor ORDER BY Name`;
//   db.query(sql, cb);
// };

const db = require('../config/db');

const doctorModel = {
  findAll: () => new Promise((resolve, reject) => {
    const sql = `
      SELECT DoctorID, Name, Specialization, Contact, Email
      FROM Doctor
      ORDER BY Name ASC`;
    db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
  }),

  findByEmailOrContact: (emailOrContact) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Doctor WHERE Email = ? OR Contact = ? LIMIT 1`;
      db.query(sql, [emailOrContact, emailOrContact], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    }),
};

module.exports = doctorModel;
