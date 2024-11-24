// models/foundryParameter.model.js
const mongoose = require('mongoose');

const FoundryParameterReadingSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  parameter: {
    type: String,
    required: true,
    enum: [
      'totalClay',
      'activeClay',
      'deadClay',
      'volatileMatter',
      'lossOnIgnition',
      'greenCompressiveStrength',
      'compactibility',
      'moisture',
      'permeabilityNumber',
      'wetTensileStrength',
      'bentoniteAddition',
      'coalDustAddition',
      'sandTemperature',
      'newSandAdditionTime',
      'newSandAdditionWeight',
      'dailyDustCollected1',
      'dailyDustCollected2',
      'totalDustCollected'
    ]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  }
}, {
  timestamps: true
});

const FoundryDailyStatSchema = new mongoose.Schema({
  date: {
    type: String,   // Change Date to String
    required: true
  },
  parameter: {
    type: String,
    required: true
  },
  average: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  count: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});



// Create indexes
FoundryParameterReadingSchema.index({ timestamp: 1, parameter: 1 });
FoundryDailyStatSchema.index({ date: 1, parameter: 1 }, { unique: true });

const FoundryParameterReading = mongoose.model('FoundryParameterReading', FoundryParameterReadingSchema);
const FoundryDailyStat = mongoose.model('FoundryDailyStat', FoundryDailyStatSchema);

module.exports = {
  FoundryParameterReading,
  FoundryDailyStat
};