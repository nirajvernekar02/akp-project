const express = require('express');
const router = express.Router();
const RunnerData = require('../models/runnerModel');
const multer = require('multer');
const path = require('path');
const moment = require('moment');

// Multer configuration for file upload
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  }),
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
  res.status(status).json({ message: error.message });
};

// GET route to retrieve data
router.get('/runnerData', async (req, res) => {
  const { startDate, endDate, type } = req.query;

  try {
    const query = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    };

    let data;
    if (type) {
      data = await RunnerData.find(query)
        .where('readings')
        .elemMatch({ type })
        .sort({ date: 1 });
    } else {
      data = await RunnerData.find(query).sort({ date: 1 });
    }

    res.json(data);
  } catch (error) {
    handleError(res, error);
  }
});

// POST route to add new runner data
router.post('/runnerData', async (req, res) => {
  const { date, time, reading, type, remark } = req.body;

  try {
    // Format date to YYYY-MM-DD if not already
    const formattedDate = moment(date).format('YYYY-MM-DD');

    let runnerData = await RunnerData.findOne({ date: formattedDate });

    if (!runnerData) {
      runnerData = new RunnerData({ date: formattedDate });
    }

    await runnerData.addReading({ 
      time, 
      reading, 
      type, 
      remark 
    });

    res.status(201).json({ message: 'Reading added successfully', runnerData });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// POST route for CSV import
router.post('/runnerData/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { date } = req.body;
  const formattedDate = moment(date).format('YYYY-MM-DD');

  try {
    const importedData = await RunnerData.importFromCSV(
      req.file.path, 
      formattedDate
    );

    res.status(201).json({
      message: 'CSV imported successfully',
      importedCount: importedData.readings.length,
      data: importedData
    });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// PUT route to update an existing reading
router.put('/runnerData/:id', async (req, res) => {
  const { id } = req.params;
  const { time, reading, type, remark } = req.body;

  try {
    const runnerData = await RunnerData.findOne({ 'readings._id': id });

    if (!runnerData) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    const readingToUpdate = runnerData.readings.id(id);
    if (time) readingToUpdate.time = time;
    if (reading !== undefined) readingToUpdate.reading = reading;
    if (type) readingToUpdate.type = type;
    if (remark !== undefined) readingToUpdate.remark = remark;

    await runnerData.save();
    res.status(200).json({ message: 'Reading updated successfully', runnerData });
  } catch (error) {
    handleError(res, error, 400);
  }
});

// DELETE route to remove a specific reading
router.delete('/runnerData/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const runnerData = await RunnerData.findOne({ 'readings._id': id });

    if (!runnerData) {
      return res.status(404).json({ message: 'Reading not found' });
    }

    runnerData.readings.id(id).remove();
    await runnerData.save();
    res.status(200).json({ message: 'Reading deleted successfully', runnerData });
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;