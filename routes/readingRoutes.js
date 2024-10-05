// routes/readingRoutes.js
const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');

router.post('/add-reading', readingController.addOrUpdateReading);
router.put('/update/:id', readingController.updateReading);
router.delete('/delete/:id/:index', readingController.deleteReading);
router.get('/all', readingController.getReadings);
router.get('/by-date/:date', readingController.getReadingsByDate);
router.post('/upload', readingController.uploadReadings);

module.exports = router;