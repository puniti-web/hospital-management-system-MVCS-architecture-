    const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const patientModel = require("../models/patientModel");

const signToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "2h" });

exports.registerPatient = (data, cb) => {
  if (!data.Name || !data.Email || !data.Password) return cb({ status: 400, message: "Missing fields" });
  const hash = bcrypt.hashSync(data.Password, 10);
  patientModel.create({ ...data, Password: hash }, (err, result) => {
    if (err) return cb({ status: 500, message: err.message });
    cb(null, { token: signToken({ id: result.insertId, role: "patient" }), id: result.insertId, role: "patient" });
  });
};

exports.registerDoctor = (data, cb) => {
  if (!data.Name || !data.Email || !data.Password) return cb({ status: 400, message: "Missing fields" });
  const hash = bcrypt.hashSync(data.Password, 10);
  doctorModel.create({ ...data, Password: hash }, (err, result) => {
    if (err) return cb({ status: 500, message: err.message });
    cb(null, { token: signToken({ id: result.insertId, role: "doctor" }), id: result.insertId, role: "doctor" });
  });
};

exports.login = ({ role, emailOrContact, password }, cb) => {
  if (!role || !emailOrContact || !password) return cb({ status: 400, message: "Missing fields" });
  const model = role === "doctor" ? doctorModel : patientModel;
  const idCol = role === "doctor" ? "DoctorID" : "PatientID";

  model.findByEmailOrContact(emailOrContact, async (err, rows) => {
    if (err) return cb({ status: 500, message: err.message });
    if (!rows.length) return cb({ status: 404, message: "User not found" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.Password || "");
    if (!ok) return cb({ status: 401, message: "Invalid credentials" });

    const token = signToken({ id: user[idCol], role });
    cb(null, { token, id: user[idCol], role, name: user.Name });
  });
};
