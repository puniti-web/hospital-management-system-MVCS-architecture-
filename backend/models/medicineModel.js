const db = require('../config/db');

const medicineModel = {
  findAll: () => new Promise((resolve, reject) => {
    const sql = `
      SELECT MedicineID, Name, Category, Price, Stock, Manufacturer, Description
      FROM Medicine
      ORDER BY Name ASC`;
    db.query(sql, (err, rows) => err ? reject(err) : resolve(rows));
  }),

  findById: (MedicineID) => new Promise((resolve, reject) => {
    const sql = `SELECT * FROM Medicine WHERE MedicineID = ?`;
    db.query(sql, [MedicineID], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  }),

  updateStock: (MedicineID, quantity) => new Promise((resolve, reject) => {
    const sql = `UPDATE Medicine SET Stock = Stock - ? WHERE MedicineID = ?`;
    db.query(sql, [quantity, MedicineID], (err) => err ? reject(err) : resolve());
  })
};

module.exports = medicineModel;

