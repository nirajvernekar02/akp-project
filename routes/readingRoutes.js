// routes/readingRoutes.js
const express = require('express');
const router = express.Router();
const readingController = require('../controllers/readingController');

// Route to add new readings
router.post('/add-reading', readingController.addOrUpdateReading);
router.put('/update/:id', readingController.updateReading); // Update readings
router.delete('/delete/:id', readingController.deleteReading); // Delete readings
router.get('/all', readingController.getReadings);

module.exports = router;
