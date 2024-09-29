// // controllers/readingController.js
// const Reading = require('../models/readingModel');

// // Function to add new readings
// exports.addReading = async (req, res) => {
//   try {
//     const { readings, upperLimit, lowerLimit } = req.body;

//     // Check if the request contains required fields
//     if (!readings || !upperLimit || !lowerLimit) {
//       return res.status(400).json({ message: 'Missing required fields.' });
//     }

//     // Find or create today's reading entry
//     let readingEntry = await Reading.findOne({
//       date: { $gte: new Date().setHours(0, 0, 0, 0) },
//     });

//     if (readingEntry) {
//       // Append new readings
//       readingEntry.readings.push(...readings);
//     } else {
//       // Create a new entry for today's readings
//       readingEntry = new Reading({
//         readings,
//         upperLimit,
//         lowerLimit,
//       });
//     }

//     // Recalculate metrics immediately to keep everything up-to-date
//     readingEntry.calculateMetrics();

//     // Save the updated/new reading entry
//     await readingEntry.save();

//     res.status(200).json({ message: 'Readings added successfully.', data: readingEntry });
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding readings.', error: error.message });
//   }
// };


// // Update existing readings for a given day
// exports.updateReading = async (req, res) => {
//     try {
//       const { id } = req.params;
//       const { readings, upperLimit, lowerLimit } = req.body;
  
//       const readingEntry = await Reading.findById(id);
//       if (!readingEntry) {
//         return res.status(404).json({ message: 'Reading entry not found.' });
//       }
  
//       // Update fields
//       if (readings) readingEntry.readings = readings;
//       if (upperLimit !== undefined) readingEntry.upperLimit = upperLimit;
//       if (lowerLimit !== undefined) readingEntry.lowerLimit = lowerLimit;
  
//       // Recalculate metrics
//       readingEntry.calculateMetrics();
  
//       await readingEntry.save();
  
//       res.status(200).json({ message: 'Reading updated successfully.', data: readingEntry });
//     } catch (error) {
//       res.status(500).json({ message: 'Error updating reading.', error: error.message });
//     }
//   };
  
//   // Delete readings for a given day
//   exports.deleteReading = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const readingEntry = await Reading.findByIdAndDelete(id);
//       if (!readingEntry) {
//         return res.status(404).json({ message: 'Reading entry not found.' });
//       }
  
//       res.status(200).json({ message: 'Reading deleted successfully.' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error deleting reading.', error: error.message });
//     }
//   };

//   // Get all readings
// exports.getReadings = async (req, res) => {
//     try {
//       const readings = await Reading.find();
//       res.status(200).json({ data: readings });
//     } catch (error) {
//       res.status(500).json({ message: 'Error fetching readings.', error: error.message });
//     }
//   };

// controllers/readingController.js
const Reading = require('../models/readingModel');

// Add new readings for today or update if already present
exports.addOrUpdateReading = async (req, res) => {
  try {
    const { readings, upperLimit, lowerLimit, date } = req.body;

    // Validate request fields
    if (!readings || !upperLimit || !lowerLimit) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const readingDate = date ? new Date(date).setHours(0, 0, 0, 0) : new Date().setHours(0, 0, 0, 0);

    // Find or create today's reading entry
    let readingEntry = await Reading.findOne({ date: readingDate });

    if (readingEntry) {
      // Append new readings if entry exists
      readingEntry.readings.push(...readings);
    } else {
      // Create a new entry for today's readings
      readingEntry = new Reading({
        readings,
        upperLimit,
        lowerLimit,
        date: readingDate,
      });
    }

    // Recalculate metrics
    readingEntry.calculateMetrics();

    // Save the updated/new reading entry
    await readingEntry.save();

    res.status(200).json({ message: 'Readings added/updated successfully.', data: readingEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error adding/updating readings.', error: error.message });
  }
};

// Update existing readings for a given day
exports.updateReading = async (req, res) => {
  try {
    const { id } = req.params;
    const { readings, upperLimit, lowerLimit } = req.body;

    const readingEntry = await Reading.findById(id);
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading entry not found.' });
    }

    // Update fields
    if (readings) readingEntry.readings = readings;
    if (upperLimit !== undefined) readingEntry.upperLimit = upperLimit;
    if (lowerLimit !== undefined) readingEntry.lowerLimit = lowerLimit;

    // Recalculate metrics
    readingEntry.calculateMetrics();

    await readingEntry.save();

    res.status(200).json({ message: 'Reading updated successfully.', data: readingEntry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating reading.', error: error.message });
  }
};

// Delete readings for a given day
exports.deleteReading = async (req, res) => {
  try {
    const { id } = req.params;

    const readingEntry = await Reading.findByIdAndDelete(id);
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading entry not found.' });
    }

    res.status(200).json({ message: 'Reading deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting reading.', error: error.message });
  }
};

// Get all readings
exports.getReadings = async (req, res) => {
  try {
    const readings = await Reading.find();
    res.status(200).json({ data: readings });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching readings.', error: error.message });
  }
};

