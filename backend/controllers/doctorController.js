const doctorService = require('../services/doctorService');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await doctorService.listDoctors();
    res.json({ success: true, data: doctors });
  } catch (e) {
    console.error('getAllDoctors:', e);
    res.status(500).json({ success: false, message: 'Failed to fetch doctors' });
  }
};
