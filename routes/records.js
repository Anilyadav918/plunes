const express = require('express');
const upload = require('../middleware/upload');
const {
  readExcel,
  getHospitalDetails,
  getDoctorDetails,
  getHospitalAndDoctorDetails,
  createCalenderSlot,
} = require('../controllers/records');

const router = express.Router();
router.route('/getHospital').post(getHospitalDetails);
router.route('/getDoctor').post(getDoctorDetails);
router.route('/getHospitalAndDoctor').post(getHospitalAndDoctorDetails);
router.route('/read-excel-and-add-to-db').post(readExcel);
router.route('/create-calender-slot').post(createCalenderSlot);
//upload.single('file'),

module.exports = router;
