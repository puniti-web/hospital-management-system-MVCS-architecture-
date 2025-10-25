// import db from '../db.js';

// export const assignWard = (req, res) => {
//   const { wardId, patientId } = req.body;
//   const query = 'UPDATE Ward SET AssignedPatientID = ? WHERE WardID = ?';
//   db.query(query, [patientId, wardId], err => {
//     if (err) return res.status(500).json({ message: 'DB error' });
//     res.json({ message: 'Patient assigned to ward' });
//   });
// };
const wardService = require("../services/wardService");

exports.list = (req, res) => {
  wardService.listAll((err, rows) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(rows);
  });
};

exports.assign = (req, res) => {
  const { wardId, patientId } = req.body;
  wardService.assign(wardId, patientId, (err, result) => {
    if (err) return res.status(err.status).json({ message: err.message });
    res.json(result);
  });
};
