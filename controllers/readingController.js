// controllers/readingController.js
const Reading = require('../models/readingModel');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
}).single('file');

// Controller methods
exports.uploadReadings = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const results = [];
    const targetDate = new Date(req.body.date).setHours(0, 0, 0, 0);

    try {
      // Read CSV file
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', resolve)
          .on('error', reject);
      });

      // Process CSV data
      let reading = await Reading.findOne({ date: targetDate });
      if (!reading) {
        reading = new Reading({ date: targetDate });
      }

      // Update readings and limits
      if (results[0].upperLimit) {
        reading.upperLimit = parseFloat(results[0].upperLimit);
      }
      if (results[0].lowerLimit) {
        reading.lowerLimit = parseFloat(results[0].lowerLimit);
      }

      // Add new readings to existing array
      const newReadings = results.map(row => parseFloat(row.reading)).filter(val => !isNaN(val));
      reading.readings = [...reading.readings, ...newReadings];

      // Calculate metrics
      reading.calculateMetrics();

      // Save to database
      await reading.save();

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({ message: 'Readings uploaded successfully', reading });
    } catch (error) {
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.addOrUpdateReading = async (req, res) => {
  try {
    const { readings, upperLimit, lowerLimit, date } = req.body;
    const readingDate = new Date(date).setHours(0, 0, 0, 0);

    let readingEntry = await Reading.findOne({ date: readingDate });

    if (readingEntry) {
      // Append new readings to existing ones
      readingEntry.readings.push(...readings);

      // Update limits if provided
      if (upperLimit !== undefined) {
        readingEntry.upperLimit = upperLimit;
      }
      if (lowerLimit !== undefined) {
        readingEntry.lowerLimit = lowerLimit;
      }
    } else {
      // Create a new entry
      readingEntry = new Reading({
        readings,
        upperLimit,
        lowerLimit,
        date: readingDate,
      });
    }

    // Calculate metrics regardless of limits being provided or not
    readingEntry.calculateMetrics();

    await readingEntry.save();

    res.status(200).json({ message: 'Readings added/updated successfully.', data: readingEntry });
  } catch (error) {
    console.error("Error in addOrUpdateReading:", error);
    res.status(500).json({ message: 'Error adding/updating readings.', error: error.message });
  }
};

exports.updateReading = async (req, res) => {
  try {
    const { id } = req.params;
    const { readings, upperLimit, lowerLimit } = req.body;

    const readingEntry = await Reading.findById(id);
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading entry not found.' });
    }

    if (readings) readingEntry.readings = readings;
    if (upperLimit !== undefined) readingEntry.upperLimit = upperLimit;
    if (lowerLimit !== undefined) readingEntry.lowerLimit = lowerLimit;

    readingEntry.calculateMetrics();
    await readingEntry.save();

    res.status(200).json({ message: 'Reading updated successfully.', data: readingEntry });
  } catch (error) {
    console.error("Error in updateReading:", error);
    res.status(500).json({ message: 'Error updating reading.', error: error.message });
  }
};

exports.deleteReading = async (req, res) => {
  try {
    const { id, index } = req.params;
    const readingEntry = await Reading.findById(id);
    
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading entry not found.' });
    }
    
    // Remove the specific reading at the given index
    readingEntry.readings.splice(index, 1);
    
    // Recalculate metrics
    readingEntry.calculateMetrics();
    
    // Save the updated document
    await readingEntry.save();
    
    res.status(200).json({ 
      message: 'Reading deleted successfully.',
      data: readingEntry
    });
  } catch (error) {
    console.error("Error in deleteReading:", error);
    res.status(500).json({ message: 'Error deleting reading.', error: error.message });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const readings = await Reading.find().sort({ date: -1 });
    res.status(200).json({ data: readings });
  } catch (error) {
    console.error("Error in getReadings:", error);
    res.status(500).json({ message: 'Error fetching readings.', error: error.message });
  }
};

exports.getReadingsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const readingDate = new Date(date).setHours(0, 0, 0, 0);
    const reading = await Reading.findOne({ date: readingDate });
    
    if (!reading) {
      return res.status(404).json({ message: 'No readings found for the specified date.' });
    }
    
    res.status(200).json({ data: reading });
  } catch (error) {
    console.error("Error in getReadingsByDate:", error);
    res.status(500).json({ message: 'Error fetching readings by date.', error: error.message });
  }
};
