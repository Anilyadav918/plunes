const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
    },
    hospitalName: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [1000, 'Name cannot be more than 100 characters'],
    },
    mobileNumber: {
      type: Number,
      required: [true, 'Please add a mobile number'],
    },
    address: {
      type: String,
      required: [true, 'Please add a address'],
    },
    doctorName: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    specialityPanel: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    consultationFees: {
      type: String,
      required: true,
    },
    days: {
      type: [String],
      required: true,
    },
    timings: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    doctorDetails: {
      type: String,
      required: true,
      trim: true,
      // maxlength: [1000, 'Name cannot be more than 100 characters'],
    },
    hospitalDetails: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Record', RecordSchema);
