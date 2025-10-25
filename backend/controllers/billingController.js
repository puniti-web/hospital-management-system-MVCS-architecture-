// import db from '../db.js';

// export const generateBill = (req, res) => {
//   const { patientId, amount } = req.body;
//   const query = `
//     INSERT INTO Billing (PatientID, Amount, DateIssued, PaymentStatus)
//     VALUES (?, ?, CURDATE(), 'Pending')
//   `;
//   db.query(query, [patientId, amount], err => {
//     if (err) return res.status(500).json({ message: 'Billing error' });
//     res.json({ message: 'Bill generated successfully!' });
//   });
// };
