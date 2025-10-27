const medicineModel = require('../models/medicineModel');

const medicineService = {
  listMedicines: async () => await medicineModel.findAll(),
  getMedicine: async (MedicineID) => await medicineModel.findById(MedicineID),
  updateStock: async (MedicineID, quantity) => await medicineModel.updateStock(MedicineID, quantity)
};

module.exports = medicineService;

