// routes/foundryReadings.js
const express = require('express');
const router = express.Router();
const foundryReadingController = require('../controllers/foundryReadingController');

// Add a new reading for a specific parameter
router.post('/readings', foundryReadingController.addReading);

// Get readings with optional date and parameter filtering
router.get('/readings', foundryReadingController.getReadings);

// Get averages for a date range
router.get('/readings/averages', foundryReadingController.getAverages);

// Get statistics for a specific parameter on a specific date
router.get('/readings/stats', foundryReadingController.getParameterStats);

module.exports = router;