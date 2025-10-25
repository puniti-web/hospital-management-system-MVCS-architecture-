// import db from '../db.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';

// export const login = (req, res) => {
//   const { email, password, role } = req.body;
//   let table = role === 'doctor' ? 'Doctor' : role === 'admin' ? 'Doctor' : 'Patient';
//   const query = `SELECT * FROM ${table} WHERE Email = ? OR Contact = ?`;

//   db.query(query, [email, email], async (err, results) => {
//     if (err) return res.status(500).json({ message: 'DB error' });
//     if (results.length === 0) return res.status(404).json({ message: 'User not found' });

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.Password);
//     if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

//     const token = jwt.sign(
//       { id: user.DoctorID || user.PatientID, role },
//       process.env.JWT_SECRET,
//       { expiresIn: '2h' }
//     );

//     res.json({ token, role });
//   });
// };
const authService = require("../services/authService");

exports.registerPatient = (req, res) => {
  authService.registerPatient(req.body, (err, result) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(result);
  });
};

exports.registerDoctor = (req, res) => {
  authService.registerDoctor(req.body, (err, result) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(result);
  });
};

exports.login = (req, res) => {
  authService.login(req.body, (err, result) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(result);
  });
};
