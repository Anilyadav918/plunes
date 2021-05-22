const mongoose = require('mongoose');

const CalenderSchema = new mongoose.Schema(
  {
    doctorId: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    day: {
      type: String,
    },
    onLeave: {
      type: Boolean,
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

module.exports = mongoose.model('Calender', CalenderSchema);
