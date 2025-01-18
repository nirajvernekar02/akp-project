// routes/foundryParameter.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const CombinedReadingController = require('../controllers/foundryController');
// const { authenticate } = require('../middleware/auth'); // Assuming you have authentication middleware

// // Add authentication middleware to all routes
// router.use(authenticate);

// Add new reading
// Example API routes
router.post('/readings', CombinedReadingController.addReading);
router.get('/readings/:date/:type', CombinedReadingController.getReadings);
router.get('/stats', CombinedReadingController.getDailyStats);
router.post('/import', upload.single('file'), CombinedReadingController.importCSV);
router.post('/limits', CombinedReadingController.updateLimits);

module.exports = router;