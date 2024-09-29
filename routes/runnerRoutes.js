const express = require('express');
const router = express.Router();
const RunnerData = require('../models/runnerModel');

// GET route to retrieve data based on a date range
router.get('/runnerData', async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const data = await RunnerData.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST route to add new runner data
router.post('/runnerData', async (req, res) => {
  const { date, time, reading } = req.body;

  const newData = new RunnerData({
    date,
    time,
    reading
  });

  try {
    const savedData = await newData.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
