// models/FoundryReading.js
const mongoose = require('mongoose');

// Schema for individual reading values with timestamp
const readingValueSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

const foundryReadingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  // Arrays of readings for each parameter
  totalClay: [readingValueSchema], // T.C %
  activeClay: [readingValueSchema], // A.C %
  deadClay: [readingValueSchema], // D.C %
  volatileMatter: [readingValueSchema], // V.M %
  lossOnIgnition: [readingValueSchema], // L.O.I %
  greenCompressiveStrength: [readingValueSchema], // G.C.STR. Gm/cm2
  compactibility: [readingValueSchema], // COMPACT. %
  moisture: [readingValueSchema], // Moisture%
  permeabilityNumber: [readingValueSchema], // Perm. Nos.
  wetTensileStrength: [readingValueSchema], // W.T.S. gm/cm2
  bentoniteAddition: [readingValueSchema], // Bentonite Addition Kg/%
  coalDustAddition: [readingValueSchema], // Coal Dust Addition Kg
  sandTemperature: [readingValueSchema], // Sand Temp.at moulding Box
  newSandAdditionTime: [readingValueSchema], // New sand addition Timer sec. (Mixer)
  newSandAdditionWeight: [readingValueSchema], // New sand addition kg (Mixer)
  dustSuctionStatus1: [{ 
    value: { type: Boolean },
    timestamp: { type: Date, default: Date.now }
  }], // Dust Suction open status 1 (Old)
  dustSuctionStatus2: [{ 
    value: { type: Boolean },
    timestamp: { type: Date, default: Date.now }
  }], // Dust Suction open status 2 (New)
  dailyDustCollected1: [readingValueSchema], // Daily Dust collected 1 (Old) Wt.in kg
  dailyDustCollected2: [readingValueSchema], // Daily Dust collected 2 (New) Wt.in kg
  totalDustCollected: [readingValueSchema], // Daily Dust collected total Wt.in kg
}, {
  timestamps: true
});

foundryReadingSchema.index({ date: 1 });

const FoundryReading = mongoose.model('FoundryReading', foundryReadingSchema);
module.exports = FoundryReading;