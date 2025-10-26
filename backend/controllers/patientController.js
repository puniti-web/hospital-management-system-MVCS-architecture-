const patientModel = require("../models/patientModel");
const bcrypt = require("bcryptjs");

exports.register = async (req, res) => {
  try {
    const { name, age, gender, contact, address, email, password } = req.body;

    // Validate required fields
    if (!name || !age || !gender || !contact || !address || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: "All fields are required" 
      });
    }

    // Check if email already exists
    const existingPatient = await patientModel.findByEmail(email);
    if (existingPatient) {
      return res.status(409).json({ 
        success: false, 
        message: "Email already registered" 
      });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new patient
    const patientId = await patientModel.create({
      Name: name,
      Age: parseInt(age),
      Gender: gender,
      Contact: contact,
      Address: address,
      Email: email,
      Password: hashedPassword
    });

    res.json({ 
      success: true, 
      message: "Patient registered successfully",
      patientId 
    });
  } catch (error) {
    console.error("Patient registration error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Registration failed" 
    });
  }
};
