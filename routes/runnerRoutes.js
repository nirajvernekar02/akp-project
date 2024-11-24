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

// POST route to add new reading
router.post('/runnerData', async (req, res) => {
  try {
    const { date, time, reading, type, remark } = req.body;

    // Validate required fields
    if (!date || !time || reading === undefined || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate reading type
    if (!LIMITS[type]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reading type'
      });
    }

    const formattedDate = moment(date).startOf('day').toDate();

    // Find or create document for the date and type
    let runnerData = await RunnerData.findOne({
      date: formattedDate,
      type: type
    });

    if (!runnerData) {
      runnerData = new RunnerData({
        date: formattedDate,
        type: type,
        upperLimit: LIMITS[type].upper,
        lowerLimit: LIMITS[type].lower,
        readings: []
      });
    }

    // Add new reading
    runnerData.readings.push({
      time,
      reading: parseFloat(reading),
      remark
    });

    // Recalculate metrics
    runnerData.calculateMetrics();
    await runnerData.save();

    res.status(201).json({
      success: true,
      message: 'Reading added successfully',
      data: runnerData
    });
  } catch (error) {
    handleError(res, error, 400);
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

  const { date, type } = req.body;

  if (!date || !type || !LIMITS[type]) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing date or type'
    });
  }

  try {
    const formattedDate = moment(date).startOf('day').toDate();
    const results = [];

    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', resolve)
        .on('error', reject);
    });

    // Find or create document for the date and type
    let runnerData = await RunnerData.findOne({
      date: formattedDate,
      type: type
    });

    if (!runnerData) {
      runnerData = new RunnerData({
        date: formattedDate,
        type: type,
        upperLimit: LIMITS[type].upper,
        lowerLimit: LIMITS[type].lower,
        readings: []
      });
    }

    // Process CSV data
    for (const row of results) {
      if (row.time && row.reading) {
        runnerData.readings.push({
          time: row.time,
          reading: parseFloat(row.reading),
          remark: row.remark || ''
        });
      }
    }

    // Recalculate metrics and save
    runnerData.calculateMetrics();
    await runnerData.save();

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: 'CSV imported successfully',
      importedCount: results.length,
      data: runnerData
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    handleError(res, error, 400);
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
        message: 'Data not found'
      });
    }

    const readingToDelete = runnerData.readings.id(readingId);
    if (!readingToDelete) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found'
      });
    }

    readingToDelete.remove();
    runnerData.calculateMetrics();
    await runnerData.save();

    res.json({
      success: true,
      message: 'Reading deleted successfully',
      data: runnerData
    });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;