const express = require('express');
const router = express.Router();
const RunnerData = require('../models/runnerModel');
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const csv = require('csv-parser');
const fs = require('fs');

// Type-specific limits constant (matching our model)
const LIMITS = {
  moisture: { lower: 3.60, upper: 4.40 },
  preamibility: { lower: 115, upper: 155 },
  compactibility: { lower: 38, upper: 46 },
  cgs: { lower: 1100, upper: 1500 }
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Utility function to handle errors
const handleError = (res, error, status = 500) => {
  console.error('Error:', error);
  res.status(status).json({ 
    success: false,
    message: error.message 
  });
};

// GET route to retrieve data with enhanced filtering and sorting
router.get('/runner', async (req, res) => {
  try {
    const { date, startDate, endDate, type } = req.query;

    const query = {};

    // Filter by a specific date
    if (date) {
      query.date = {
        $gte: moment(date).startOf('day').toDate(),
        $lte: moment(date).endOf('day').toDate(),
      };
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate(),
      };
    }

    // Filter by type if provided
    if (type) {
      query.type = type;
    }

    // Fetch data from the database
    const data = await RunnerData.find(query)
      .sort({ date: -1 }) // Sort by date (new to old)
      .lean();

    // Prepare the response
    const response = {
      success: true,
      data,
      count: data.length,
    };

    // Add type-specific stats if a type is specified and data is available
    if (type && data.length > 0) {
      const allReadings = data.flatMap((d) => d.readings.map((r) => r.reading));
      const stats = {
        overall: {
          min: Math.min(...allReadings),
          max: Math.max(...allReadings),
          avg: allReadings.reduce((a, b) => a + b, 0) / allReadings.length,
          count: allReadings.length,
          limits: LIMITS[type] || null, // Replace with appropriate limits for the type
        },
      };
      response.stats = stats;
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching runner data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching runner data',
      error: error.message,
    });
  }
});


// GET route to retrieve data with enhanced filtering
router.get('/runnerData', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    
    const query = {};
    
    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }
    
    // Add type if provided
    if (type) {
      query.type = type;
    }

    const data = await RunnerData.find(query)
      .sort({ date: 1, type: 1 })
      .lean();

    const response = {
      success: true,
      data,
      count: data.length
    };

    // Add type-specific stats if type is specified
    if (type && data.length > 0) {
      const allReadings = data.flatMap(d => d.readings.map(r => r.reading));
      const stats = {
        overall: {
          min: Math.min(...allReadings),
          max: Math.max(...allReadings),
          avg: allReadings.reduce((a, b) => a + b, 0) / allReadings.length,
          count: allReadings.length,
          limits: LIMITS[type]
        }
      };
      response.stats = stats;
    }

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
});

router.get('/runnerDataMoisture', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};

    // Add date range if provided
    if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).startOf('day').toDate(),
        $lte: moment(endDate).endOf('day').toDate()
      };
    }

    // Fetch data for both moisture and compactibility types
    const data = await RunnerData.find({ ...query, type: { $in: ['moisture', 'compactibility'] } })
      .sort({ date: 1, type: 1 })
      .lean();

    // Multiply moisture readings by 10
    data.forEach(d => {
      if (d.type === 'moisture' && d.readings) {
        d.readings = d.readings.map(r => ({
          ...r,
          reading: r.reading * 10 // Multiply each moisture reading by 10
        }));
      }
    });

    const response = {
      success: true,
      data,
      count: data.length
    };

    res.json(response);
  } catch (error) {
    handleError(res, error);
  }
});


// POST route to add new reading
// POST route to add new reading
// POST route for manual entry
router.post('/runnerData', async (req, res) => {
  try {
    const { date, time, reading, type, remark } = req.body;

    // Validate required fields
    if (!date || !time || reading === undefined || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate reading type
    if (!LIMITS[type]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reading type',
      });
    }

    // Format date for storage (stays one day behind as before)
    const formattedDate = moment(date).startOf('day').toDate();

    // For duplicate checking, use the next day's date
    const checkDate = moment(date).add(1, 'days').startOf('day').toDate();

    // First check if document exists for the next day (for duplicate checking)
    let duplicateDoc = await RunnerData.findOne({
      date: checkDate,
      type: type
    });

    if (duplicateDoc) {
      // Check for duplicate time
      const hasDuplicateTime = duplicateDoc.readings.some(existing => 
        existing.time === time
      );

      if (hasDuplicateTime) {
        return res.status(200).json({
          success: false,
          message: `Reading for time ${time} already exists on ${moment(date).format('DD-MM-YYYY')}`,
        });
      }
    }

    // If no duplicates found, proceed with finding or creating document for storage
    let existingDoc = await RunnerData.findOne({
      date: formattedDate,
      type: type
    });

    if (existingDoc) {
      existingDoc.readings.push({
        time,
        reading: parseFloat(reading),
        remark,
      });

      existingDoc.calculateMetrics();
      await existingDoc.save();

      return res.status(201).json({
        success: true,
        message: 'Reading added successfully',
        data: existingDoc,
      });
    }

    // Create new document if none exists
    const newRunnerData = new RunnerData({
      date: formattedDate,
      type: type,
      upperLimit: LIMITS[type].upper,
      lowerLimit: LIMITS[type].lower,
      readings: [{
        time,
        reading: parseFloat(reading),
        remark,
      }]
    });

    newRunnerData.calculateMetrics();
    await newRunnerData.save();

    res.status(201).json({
      success: true,
      message: 'Reading added successfully',
      data: newRunnerData,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// POST route for CSV import
router.post('/runnerData/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  const { type } = req.body;

  if (!type || !LIMITS[type]) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing type'
    });
  }

  try {
    const results = [];
    const duplicates = [];
    const skipped = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => {
          if (data.date && data.time && data.reading) {
            results.push(data);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (results.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'CSV file is empty or contains invalid data'
      });
    }

    // Group readings by date
    const groupedReadings = results.reduce((acc, row) => {
      // Parse date in dd-mm-yyyy format
      const parsedDate = moment(row.date, 'DD-MM-YYYY');
      
      if (!parsedDate.isValid()) {
        skipped.push(`Invalid date format: ${row.date}`);
        return acc;
      }

      // Use the date as is - the timezone conversion will handle the day shift
      const dateKey = parsedDate.format('YYYY-MM-DD');
      
      const time = row.time;
      const reading = parseFloat(row.reading);
      const remark = row.remark || '';

      if (isNaN(reading)) {
        skipped.push(`Invalid reading value: ${row.reading} for date ${row.date}`);
        return acc;
      }

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push({ time, reading, remark, originalDate: row.date });
      return acc;
    }, {});

    // Process grouped readings
    const importedDocs = [];
    for (const [dateString, readings] of Object.entries(groupedReadings)) {
      // Get the stored date (which will be a day before due to timezone)
      const storedDate = moment(dateString).toDate();

      // Find existing document
      let existingDoc = await RunnerData.findOne({
        date: storedDate,
        type: type
      });

      if (existingDoc) {
        // Filter out duplicates by comparing times
        const newReadings = readings.filter(newReading => {
          const isDuplicate = existingDoc.readings.some(existing => 
            existing.time === newReading.time
          );
          
          if (isDuplicate) {
            duplicates.push(`Reading for date ${newReading.originalDate} at time ${newReading.time} already exists`);
            return false;
          }
          return true;
        });

        if (newReadings.length > 0) {
          // Add only non-duplicate readings
          existingDoc.readings.push(...newReadings);
          existingDoc.calculateMetrics();
          await existingDoc.save();
          importedDocs.push(existingDoc);
        }
      } else {
        // Create new document
        const newDoc = new RunnerData({
          date: storedDate,
          type: type,
          upperLimit: LIMITS[type].upper,
          lowerLimit: LIMITS[type].lower,
          readings: readings
        });
        newDoc.calculateMetrics();
        await newDoc.save();
        importedDocs.push(newDoc);
      }
    }

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'CSV imported successfully',
      importedCount: results.length - duplicates.length - skipped.length,
      documentsCreated: importedDocs.length,
      duplicates: duplicates,
      skipped: skipped
    });

  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error importing CSV',
      error: error.message
    });
  }
});

// PUT route to update limits
router.put('/runnerData/:id/limits', async (req, res) => {
  try {
    const { id } = req.params;
    const { upperLimit, lowerLimit } = req.body;

    const runnerData = await RunnerData.findById(id);
    if (!runnerData) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    if (upperLimit !== undefined) runnerData.upperLimit = upperLimit;
    if (lowerLimit !== undefined) runnerData.lowerLimit = lowerLimit;

    runnerData.calculateMetrics();
    await runnerData.save();

    res.json({
      success: true,
      message: 'Limits updated successfully',
      data: runnerData
    });
  } catch (error) {
    handleError(res, error);
  }
});

// PUT route to update a specific reading
router.put('/runnerData/:id/readings/:readingId', async (req, res) => {
  try {
    const { id, readingId } = req.params;
    const { time, reading, remark } = req.body;

    const runnerData = await RunnerData.findById(id);
    if (!runnerData) {
      return res.status(404).json({
        success: false,
        message: 'Data not found'
      });
    }

    const readingToUpdate = runnerData.readings.id(readingId);
    if (!readingToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found'
      });
    }

    if (time) readingToUpdate.time = time;
    if (reading !== undefined) readingToUpdate.reading = parseFloat(reading);
    if (remark !== undefined) readingToUpdate.remark = remark;

    runnerData.calculateMetrics();
    await runnerData.save();

    res.json({
      success: true,
      message: 'Reading updated successfully',
      data: runnerData
    });
  } catch (error) {
    handleError(res, error);
  }
});

// DELETE route to remove a specific reading
router.delete('/runnerData/:id/readings/:readingId', async (req, res) => {
  try {
    const { id, readingId } = req.params;

    const runnerData = await RunnerData.findById(id);
    if (!runnerData) {
      return res.status(404).json({
        success: false,
        message: 'Data not found',
      });
    }
    console.log("Runner Data",runnerData)
    const readingToDelete = runnerData.readings.id(readingId);
    if (!readingToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found',
      });
    }
    console.log("Reading to delete",readingToDelete)
    readingToDelete.deleteOne(); // This should now work if schema is correct
    runnerData.calculateMetrics(); // Ensure this method is properly defined if used
    await runnerData.save();

    res.json({
      success: true,
      message: 'Reading deleted successfully',
      data: runnerData,
    });
  } catch (error) {
    console.error('Error deleting reading:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


router.get('/metrics', async (req, res) => {
    try {
        const { startDate, endDate, type } = req.query;

        if (!startDate || !endDate || !type) {
            return res.status(400).json({
                error: 'Start date, end date, and type are required'
            });
        }

        // Convert dates to UTC to ensure consistent querying
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Validate dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                error: 'Invalid date format'
            });
        }

        // Get all readings within the date range
        const readings = await RunnerData.find({
            date: {
                $gte: start,
                $lte: end
            },
            type: type
        }).sort({ date: 1 });

        if (readings.length === 0) {
            return res.status(404).json({
                message: 'No readings found for the specified date range and type'
            });
        }

        // Combine all readings into a single array
        const allReadings = readings.reduce((acc, doc) => {
            return acc.concat(doc.readings.map(r => r.reading));
        }, []);

        // Get type-specific limits
        const LIMITS = {
            moisture: { lower: 3.60, upper: 4.40 },
            preamibility: { lower: 115, upper: 155 },
            compactibility: { lower: 38, upper: 46 },
            cgs: { lower: 1100, upper: 1500 }
        };

        const typeLimits = LIMITS[type];
        const upperLimit = typeLimits.upper;
        const lowerLimit = typeLimits.lower;

        // Calculate metrics
        const average = allReadings.reduce((a, b) => a + b, 0) / allReadings.length;

        // Standard deviation calculation
        const squareDiffs = allReadings.map(value => {
            const diff = value - average;
            return diff * diff;
        });
        const standardDeviation = Math.sqrt(
            squareDiffs.reduce((a, b) => a + b, 0) / allReadings.length
        );

        // Calculate other metrics
        const threeSigma = 3 * standardDeviation;
        const sixSigma = 6 * standardDeviation;
        const cp = (upperLimit - lowerLimit) / (6 * standardDeviation);
        const cpk1 = (average - lowerLimit) / (3 * standardDeviation);
        const cpk2 = (upperLimit - average) / (3 * standardDeviation);
        const cpk = Math.min(cpk1, cpk2);

        // Daily breakdown
        const dailyMetrics = readings.map(reading => ({
            date: reading.date,
            metrics: {
                average: reading.average,
                standardDeviation: reading.standardDeviation,
                cp: reading.cp,
                cpk: reading.cpk
            }
        }));

        res.json({
            summary: {
                startDate: start,
                endDate: end,
                type,
                numberOfReadings: allReadings.length,
                numberOfDays: readings.length,
                average,
                standardDeviation,
                threeSigma,
                sixSigma,
                cp,
                cpk1,
                cpk2,
                cpk,
                limits: {
                    upper: upperLimit,
                    lower: lowerLimit
                }
            },
            dailyMetrics
        });

    } catch (error) {
        console.error('Error calculating metrics:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
})

module.exports = router;