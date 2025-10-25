// const express = require("express");
// const router = express.Router();
// const db = require("../db");
// const auth = require("../middleware/auth");

// // Assign a patient to a ward (doctor/admin)
// router.post("/assign", auth(["doctor", "admin"]), (req, res) => {
//   const { wardId, patientId } = req.body;
//   if (!wardId || !patientId)
//     return res.status(400).json({ message: "Missing fields" });

//   const sql = `UPDATE Ward SET AssignedPatientID = ? WHERE WardID = ?`;
//   db.query(sql, [patientId, wardId], (err) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json({ message: "Patient assigned to ward" });
//   });
// });

// // List all wards (any authenticated role)
// router.get("/", auth(["patient", "doctor", "admin"]), (req, res) => {
//   db.query(`SELECT * FROM Ward`, (err, rows) => {
//     if (err) return res.status(500).json({ message: err.message });
//     res.json(rows);
//   });
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/wardController");

router.get("/", auth(["patient","doctor","admin"]), ctrl.list);
router.post("/assign", auth(["doctor","admin"]), ctrl.assign);

module.exports = router;
