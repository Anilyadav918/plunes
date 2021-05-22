const Record = require('Record');

const add = (records) => {
  return Record.create(records);
};

const getEntriesByDoctorName = (doctorName) => {
  return await Record.find({doctorName: doctorName}).select(
    'hospitalName doctorName qualification specialization specialityPanel experience consultationFees days timings designation doctorDetails ',
  );
};
