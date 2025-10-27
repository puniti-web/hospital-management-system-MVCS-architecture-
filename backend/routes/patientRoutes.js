const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patientController");

// Patient registration
router.post("/register", patientController.register);

module.exports = router;
