const medicineService = require('../services/medicineService');

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicineService.listMedicines();
    res.json({ success: true, data: medicines });
  } catch (e) {
    console.error('getAllMedicines:', e);
    res.status(500).json({ success: false, message: 'Failed to fetch medicines' });
  }
};

