const db = require('../config/db');

const patientModel = {
  findByEmail: (email) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Patient WHERE Email = ?`;
      db.query(sql, [email], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0 ? rows[0] : null);
      });
    }),

  findByEmailOrContact: (emailOrContact) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Patient WHERE Email = ? OR Contact = ? LIMIT 1`;
      db.query(sql, [emailOrContact, emailOrContact], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    }),

  create: ({ Name, Age, Gender, Contact, Address, Email, Password }) =>
    new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO Patient (Name, Age, Gender, Contact, Address, Email, Password)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const params = [Name, Age, Gender, Contact, Address, Email, Password];
      db.query(sql, params, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    }),

  findById: (patientId) =>
    new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Patient WHERE PatientID = ?`;
      db.query(sql, [patientId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows.length > 0 ? rows[0] : null);
      });
    }),

  findAll: () =>
    new Promise((resolve, reject) => {
      const sql = `SELECT PatientID, Name, Age, Gender, Contact, Address, Email FROM Patient ORDER BY Name`;
      db.query(sql, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    })
};

module.exports = patientModel;