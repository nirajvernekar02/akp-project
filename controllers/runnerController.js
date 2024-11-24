const RunnerData = require('../models/runnerModel'); // Adjust the path as necessary
const csvParser = require('csv-parser'); // Import the CSV parser
const stream = require('stream');

const importReadings = async (req, res) => {
  try {
    const results = [];
    const { type } = req.body; // Get the type from the request body

    if (!type) {
      return res.status(400).json({ message: 'Type is required' });
    }

    const csvStream = new stream.Readable();
    csvStream.push(req.file.buffer); // Use the uploaded CSV file buffer
    csvStream.push(null); // No more data

    // Parse the CSV file
    csvStream
      .pipe(csvParser())
      .on('data', (row) => {
        // Validate and format the row
        const { date, time, reading } = row;
        if (date && time && reading) {
          results.push({
            date: new Date(date), // Convert date string to Date object
            time,
            type,
            reading: parseFloat(reading), // Convert reading to a number
          });
        }
      })
      .on('end', async () => {
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
