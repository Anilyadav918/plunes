const Record = require('../models/record/Record');
const Calender = require('../models/calenderSlot/Calender');
const HttpResponses = require('../util/HttpResponses');
const Util = require('../util/Validator');
const {excelToJSON} = require('../util/excelToJson');

/**
 * @function getAvailability
 *to create array for days
 * @param {} req
 * @param {} res
 * @route 
 * @access private

 */
const getAvailability = (availability) => {
  let arr = [];
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  if (availability.includes('to')) {
    const data = availability.split(' ');
    let start = data[0];
    let end = data[2];
    let startIndex = days.indexOf(start);
    let endIndex = days.indexOf(end);
    for (let i = startIndex; i <= endIndex; i++) {
      arr.push(days[i]);
    }
  } else {
    const data = availability.split(',');
    arr.push(data[0]);
    arr.push(data[1]);
  }
  return arr;
};

/**
 * @function readExcel
 *to read and save excel to db
 * @param {} req
 * @param {} res
 * @route POST /api/v1/records/readExcel
 * @access private
 * @param {string} req.file

 */
exports.readExcel = async (req, res) => {
  try {
    const path = __basedir + '/hospitalData.xlsx';
    let data = excelToJSON(path);
    //data = JSON.stringify(data);
    //data = JSON.parse(data);
    //console.log(data);
    data.forEach(function (item, index) {
      let availability = item['Days'];
      Record.create({
        doctorId: item['Hospital Name'] + `_` + item['Doctor Name'],
        hospitalName: item['Hospital Name'],
        mobileNumber: item['Mobile Number'],
        address: item['Address'],
        doctorName: item['Doctor Name'],
        qualification: item['Qualification'],
        specialization: item['Specialization'],
        specialityPanel: item['Speciality (According to admin panel)'],
        experience: item['Experience'],
        consultationFees: item['Consultation Fees'],
        days: getAvailability(availability),
        timings: item['Timings'],
        designation: item['Designation'],
        doctorDetails: item['Doctor Details'],
        hospitalDetails: item['Hospital Details'],
      });
    });
    return res.status(200).json(HttpResponses.Ok(data, 'Success'));
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

/**
 * @function createCalenderSlot
 *to create calender slot 
 * @param {} req
 * @param {} res
 * @route POST /api/v1/records/create-calender-slot
 * @access private
 * @param {string} req.body

 */
exports.createCalenderSlot = async (req, res) => {
  try {
    const records = await Record.find({});
    const calenderSlots = [];
    records.map((record) => {
      let doctorId = record.doctorId;
      let time = record.timings.split('to');
      let startTime = time[0];
      let endTime = time[1];
      let days = record.days;
      for (let i = 0; i < days.length; i++) {
        const slot = {
          doctorId: doctorId,
          startTime: startTime,
          endTime: endTime,
          day: days[i],
          onLeave: true,
        };
        calenderSlots.push(slot);
      }
    });
    const addedData = await Calender.insertMany(calenderSlots);
    if (addedData) {
      return res.status(200).json(HttpResponses.Ok(addedData, 'Success'));
    } else {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, `data does not exist`));
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

/**
 * @function getHospitalDetails
 *to get details of a hospital
 * @param {} req
 * @param {} res
 * @route POST /api/v1/records/getHospital
 * @access private
 * @param {string} req.body

 */
exports.getHospitalDetails = async (req, res) => {
  try {
    const hospitalName = req.body.hospitalName;
    if (Util.IsNullOrUndefined(hospitalName)) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'input field not set'));
    }
    const data = await Record.find({
      hospitalName: hospitalName,
    }).select('hospitalName mobileNumber address hospitalDetails');

    if (data) {
      return res.status(200).json(HttpResponses.Ok(data, 'Success'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `data does not exist for ${hospitalName}`,
          ),
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

/**
 * @function getDoctorDetails
 *to get details of a doctor
 * @param {} req
 * @param {} res
 * @route POST /api/v1/records/getDoctor
 * @access private
 * @param {string} req.body

 */
exports.getDoctorDetails = async (req, res) => {
  try {
    const doctorName = req.body.doctorName;
    if (Util.IsNullOrUndefined(doctorName)) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'input field not set'));
    }
    const data = await Record.find({
      doctorName: doctorName,
    }).select(
      'hospitalName doctorName qualification specialization specialityPanel experience consultationFees days timings designation doctorDetails ',
    );

    if (data) {
      return res.status(200).json(HttpResponses.Ok(data, 'Success'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `data does not exist for ${hospitalName}`,
          ),
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};

/**
 * @function getHospitalAndDoctorDetails
 *to get details of a hospital
 * @param {} req
 * @param {} res
 * @route POST /api/v1/records/getHospitalAndDoctor
 * @access private
 * @param {string} req.body

 */
exports.getHospitalAndDoctorDetails = async (req, res) => {
  try {
    const hospitalName = req.body.hospitalName;
    const doctorName = req.body.doctorName;
    if (
      Util.IsNullOrUndefined(hospitalName) ||
      Util.IsNullOrUndefined(doctorName)
    ) {
      return res
        .status(400)
        .json(HttpResponses.BadRequest(null, 'input field not set'));
    }
    const data = await Record.find({
      hospitalName: hospitalName,
      doctorName: doctorName,
    });

    if (data) {
      return res.status(200).json(HttpResponses.Ok(data, 'Success'));
    } else {
      return res
        .status(400)
        .json(
          HttpResponses.BadRequest(
            null,
            `data does not exist for ${hospitalName}`,
          ),
        );
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json(
        HttpResponses.InternalServerError(err.message, 'Something went wrong'),
      );
  }
};
