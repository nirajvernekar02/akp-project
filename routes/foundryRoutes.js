// routes/foundryParameter.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const FoundryParameterController = require('../controllers/foundryController');
// const { authenticate } = require('../middleware/auth'); // Assuming you have authentication middleware

// // Add authentication middleware to all routes
// router.use(authenticate);

// Add new reading
router.post('/readings', FoundryParameterController.addReading);

// Get readings for a specific date
router.get('/readings/:date', FoundryParameterController.getReadings);

// Get daily statistics for a date range
router.get('/stats', FoundryParameterController.getDailyStats);

// Import readings from CSV
router.post('/import-csv', upload.single('file'), FoundryParameterController.importCSV);

module.exports = router;