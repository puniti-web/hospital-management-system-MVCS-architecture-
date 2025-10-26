// const express = require("express");
// const router = express.Router();
// const doctorModel = require("../models/doctorModel");

// // Get all doctors
// router.get("/", (req, res) => {
//   doctorModel.findAll((err, results) => {
//     if (err) {
//       console.error("Error fetching doctors:", err);
//       return res.status(500).json({ error: "Failed to fetch doctors" });
//     }
    
//     // Transform the data to match frontend expectations
//     const doctors = results.map(doctor => ({
//       id: doctor.ID,
//       name: doctor.Name,
//       specialization: doctor.Specialization,
//       contact: doctor.Contact,
//       email: doctor.Email
//     }));
    
//     res.json(doctors);
//   });
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllDoctors } = require('../controllers/doctorController');

// Public list; or require patient auth if you prefer
router.get('/', getAllDoctors);

module.exports = router;
