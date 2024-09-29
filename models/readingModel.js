// models/Reading.js
const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  readings: {
    type: [Number], // Array of numbers to store readings
    required: true,
    default: [],
  },
  upperLimit: {
    type: Number,
    required: true,
  },
  lowerLimit: {
    type: Number,
    required: true,
  },
  average: {
    type: Number,
    default: 0,
  },
  standardDeviation: {
    type: Number,
    default: 0,
  },
  threeSigma: {
    type: Number,
    default: 0,
  },
  sixSigma: {
    type: Number,
    default: 0,
  },
  cp: {
    type: Number,
    default: 0,
  },
  cpk1: {
    type: Number,
    default: 0,
  },
  cpk2: {
    type: Number,
    default: 0,
  },
  cpk: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0), // Date without time for daily uniqueness
    unique: true,
  },
});

// Method to calculate metrics
ReadingSchema.methods.calculateMetrics = function () {
  if (this.readings.length === 0) return;

  // Calculate average
  const sum = this.readings.reduce((acc, val) => acc + val, 0);
  this.average = sum / this.readings.length;

  // Calculate standard deviation
  const variance =
    this.readings.reduce((acc, val) => acc + Math.pow(val - this.average, 2), 0) / this.readings.length;
  this.standardDeviation = Math.sqrt(variance);

  // Calculate Sigma values
  this.threeSigma = 3 * this.standardDeviation;
  this.sixSigma = 6 * this.standardDeviation;

  // Calculate Cp, Cpk1, Cpk2, and Cpk
  if (this.sixSigma !== 0) {
    this.cp = (this.upperLimit - this.lowerLimit) / this.sixSigma;
  }
  if (this.threeSigma !== 0) {
    this.cpk1 = (this.upperLimit - this.average) / this.threeSigma;
    this.cpk2 = (this.average - this.lowerLimit) / this.threeSigma;
    this.cpk = Math.min(this.cpk1, this.cpk2);
  }
};

module.exports = mongoose.model('Reading', ReadingSchema);
