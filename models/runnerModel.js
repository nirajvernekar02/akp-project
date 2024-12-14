// const mongoose = require('mongoose');

// const RunnerDataSchema = new mongoose.Schema({
//   date: {
//     type: Date,
//     required: true
//   },
//   time: {
//     type: String,
//     required: true
//   },
//   reading: {
//     type: Number,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const RunnerData = mongoose.model('RunnerData', RunnerDataSchema);
// module.exports = RunnerData;
const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  reading: { type: Number, required: true },
  time: { type: String, required: true },
  remark:{type:String}
});

const combinedReadingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true, enum: ['moisture', 'preamibility', 'compactibility', 'cgs'] },
  readings: [readingSchema],
  upperLimit: { type: Number },
  lowerLimit: { type: Number },
  average: { type: Number, default: 0 },
  standardDeviation: { type: Number, default: 0 },
  threeSigma: { type: Number, default: 0 },
  sixSigma: { type: Number, default: 0 },
  cp: { type: Number, default: 0 },
  cpk1: { type: Number, default: 0 },
  cpk2: { type: Number, default: 0 },
  cpk: { type: Number, default: 0 }
});

// Type-specific limits
const LIMITS = {
  moisture: { lower: 3.50, upper: 4.50 },
  preamibility: { lower: 105, upper: 165 },
  compactibility: { lower: 36, upper: 48 },
  cgs: { lower: 1100, upper: 1500 }
};

combinedReadingSchema.index({ date: 1, type: 1 }, { unique: true });


combinedReadingSchema.methods.calculateMetrics = function() {
  if (this.readings.length === 0) return;

  // Get type-specific limits if not explicitly set
  if (!this.upperLimit || !this.lowerLimit) {
    const typeLimits = LIMITS[this.type];
    this.upperLimit = this.upperLimit || typeLimits.upper;
    this.lowerLimit = this.lowerLimit || typeLimits.lower;
  }

  // Calculate average
  const values = this.readings.map(r => r.reading);
  this.average = values.reduce((a, b) => a + b, 0) / values.length;

  // Calculate standard deviation
  const squareDiffs = values.map(value => {
    const diff = value - this.average;
    return diff * diff;
  });
  this.standardDeviation = Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);

  // Calculate Three Sigma and Six Sigma
  this.threeSigma = 3 * this.standardDeviation;
  this.sixSigma = 6 * this.standardDeviation;

  // Calculate Process Capability (Cp)
  this.cp = (this.upperLimit - this.lowerLimit) / (6 * this.standardDeviation);

  // Calculate Process Capability Index (Cpk)
  this.cpk1 = (this.average - this.lowerLimit) / (3 * this.standardDeviation);
  this.cpk2 = (this.upperLimit - this.average) / (3 * this.standardDeviation);
  this.cpk = Math.min(this.cpk1, this.cpk2);
};

const CombinedReading = mongoose.model('CombinedReading', combinedReadingSchema);
module.exports = CombinedReading;