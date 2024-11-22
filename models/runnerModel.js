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
// models/combinedReadingModel.js
const mongoose = require('mongoose');
const moment = require('moment');
const csv = require('csv-parser');
const fs = require('fs');

const ReadingDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['moisture', 'compactibility', 'permability', 'CGS'],
    required: true
  },
  reading: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
    }
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/.test(v);
      },
      message: props => `${props.value} is not a valid time format (HH:mm)!`
    }
  },
  remark: {
    type: String,
    default: '',
  },
});

const CombinedReadingSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: props => `${props.value} is not a valid date format (YYYY-MM-DD)!`
    }
  },
  readings: [ReadingDataSchema],
  metrics: {
    type: Map,
    of: {
      average: { type: Number, default: 0 },
      standardDeviation: { type: Number, default: 0 },
      threeSigma: { type: Number, default: 0 },
      sixSigma: { type: Number, default: 0 },
      cp: { type: Number, default: 0 },
      cpk1: { type: Number, default: 0 },
      cpk2: { type: Number, default: 0 },
      cpk: { type: Number, default: 0 },
    },
    default: {}
  },
  createdAt: {
    type: String,
    default: () => moment().format('YYYY-MM-DD HH:mm:ss')
  },
});

// Metrics calculation method for specific reading type
CombinedReadingSchema.methods.calculateMetricsForType = function (type) {
  const filteredReadings = this.readings.filter(r => r.type === type);
  
  if (filteredReadings.length === 0) return;

  const readingValues = filteredReadings.map(r => r.reading);

  const sum = readingValues.reduce((acc, val) => acc + val, 0);
  const average = Number((sum / readingValues.length).toFixed(4));

  const variance = readingValues.reduce((acc, val) => 
    acc + Math.pow(val - average, 2), 0) / readingValues.length;
  const standardDeviation = Number(Math.sqrt(variance).toFixed(4));

  const threeSigma = Number((3 * standardDeviation).toFixed(4));
  const sixSigma = Number((6 * standardDeviation).toFixed(4));

  if (!this.metrics) this.metrics = new Map();
  this.metrics.set(type, {
    average,
    standardDeviation,
    threeSigma,
    sixSigma,
    cp: 0,
    cpk1: 0,
    cpk2: 0,
    cpk: 0
  });
};

// Pre-save hook to calculate metrics for all reading types
CombinedReadingSchema.pre('save', function (next) {
  const readingTypes = [...new Set(this.readings.map(r => r.type))];
  
  readingTypes.forEach(type => {
    this.calculateMetricsForType(type);
  });

  next();
});

// Method to add reading 
CombinedReadingSchema.methods.addReading = async function (newReading) {
  // Ensure date and time are in the correct format
  newReading.date = this.date;
  
  this.readings.push(newReading);
  await this.save();
  return this;
};

// Static method for bulk CSV import
CombinedReadingSchema.statics.importFromCSV = async function (filePath, date) {
  return new Promise((resolve, reject) => {
    let runnerData;

    const findOrCreateDoc = async () => {
      runnerData = await this.findOne({ date });
      if (!runnerData) {
        runnerData = new this({ date });
      }
    };

    findOrCreateDoc()
      .then(() => {
        const results = [];

        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            try {
              for (const reading of results) {
                await runnerData.addReading({
                  type: reading.type,
                  reading: parseFloat(reading.reading),
                  time: reading.time,
                  remark: reading.remark || ''
                });
              }
              resolve(runnerData);
            } catch (error) {
              reject(error);
            }
          });
      })
      .catch(reject);
  });
};

const CombinedReading = mongoose.model('CombinedReading', CombinedReadingSchema);
module.exports = CombinedReading;