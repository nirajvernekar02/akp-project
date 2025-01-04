const RunnerData = require('../models/runnerModel'); // Adjust the path as necessary
const csvParser = require('csv-parser'); // Import the CSV parser
const stream = require('stream');

// Define the limits for validation
const LIMITS = {
  moisture: { lower: 3.50, upper: 4.50 },
  preamibility: { lower: 105, upper: 165 },
  compactibility: { lower: 36, upper: 48 },
  cgs: { lower: 1100, upper: 1500 }
};

const importReadings = async (req, res) => {
  try {
    const results = [];
    const { type } = req.body; // Get the type from the request body

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    if (!LIMITS[type]) {
      return res.status(400).json({ message: 'Invalid type provided' });
    }

    const { lower, upper } = LIMITS[type];

    const csvStream = new stream.Readable();
    csvStream.push(req.file.buffer); // Use the uploaded CSV file buffer
    csvStream.push(null); // No more data

    // Parse the CSV file
    csvStream
      .pipe(csvParser())
      .on('data', (row) => {
        const { date, time, reading } = row;

        // Validate and format the row
        if (date && time && reading) {
          const numericReading = parseFloat(reading);
          if (numericReading < lower || numericReading > upper) {
            // Skip the row if the reading is out of bounds
            console.warn(`Reading out of bounds for ${type}: ${numericReading}`);
            return;
          }

          results.push({
            date: new Date(date), // Convert date string to Date object
            time,
            type,
            reading: numericReading, // Convert reading to a number
          });
        }
      })
      .on('end', async () => {
        if (results.length === 0) {
          return res.status(400).json({ message: 'No valid readings to import' });
        }

        // Save all results to the database
        try {
          await RunnerData.insertMany(results);
          res.status(201).json({ message: 'Readings imported successfully', count: results.length });
        } catch (error) {
          res.status(500).json({ message: 'Error saving data to the database', error: error.message });
        }
      })
      .on('error', (error) => {
        res.status(500).json({ message: 'Error processing CSV file', error: error.message });
      });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = { importReadings };
