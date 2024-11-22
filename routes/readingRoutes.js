// 

// routes/combinedRoutes.js
const express = require('express');
const router = express.Router();
const combinedReadingController = require('../controllers/readingController');

// Routes for readings and metrics
router.get('/readings', combinedReadingController.getReadingsByDateRange);
router.post('/readings', combinedReadingController.addReading);
router.post('/readings/upload', combinedReadingController.uploadReadings);
router.put('/readings/:id/limits', combinedReadingController.updateLimits);
router.delete('/readings/:id/:readingId', combinedReadingController.deleteReading);

module.exports = router;