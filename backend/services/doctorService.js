const doctorModel = require('../models/doctorModel');

const doctorService = {
  listDoctors: async () => await doctorModel.findAll(),
};

module.exports = doctorService;
