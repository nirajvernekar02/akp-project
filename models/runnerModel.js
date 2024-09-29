const mongoose = require('mongoose');

const RunnerDataSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  reading: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const RunnerData = mongoose.model('RunnerData', RunnerDataSchema);
module.exports = RunnerData;
