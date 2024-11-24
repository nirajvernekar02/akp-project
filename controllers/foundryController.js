const { FoundryParameterReading, FoundryDailyStat } = require('../models/foundryReading');
const csv = require('csv-parse');

class FoundryParameterController {
  static async calculateDailyStats(dateStr) {
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);
  
    const readings = await FoundryParameterReading.find({
      timestamp: { $gte: startOfDay.toISOString(), $lte: endOfDay.toISOString() }
    });
  
    // Group readings by parameter
    const parameterGroups = {};
    readings.forEach(reading => {
      if (!parameterGroups[reading.parameter]) {
        parameterGroups[reading.parameter] = [];
      }
      parameterGroups[reading.parameter].push(reading.value);
    });
  
    // Calculate statistics for each parameter
    const stats = [];
    for (const [parameter, values] of Object.entries(parameterGroups)) {
      const numericValues = values.map(v => parseFloat(v)); // Convert string values to numbers
      stats.push({
        date: dateStr,  // Store the date as string
        parameter,
        average: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        count: numericValues.length,
        lastUpdated: new Date()
      });
    }
  
    // Update daily statistics in database
    const promises = stats.map(stat => 
      FoundryDailyStat.findOneAndUpdate(
        { date: stat.date, parameter: stat.parameter },
        stat,
        { upsert: true, new: true }
      )
    );
  
    await Promise.all(promises);
    return stats;
  }
  

  static async addReading(req, res) {
    try {
      const { value, timestamp, parameter } = req.body;
      
      // Validate required fields
      if (!value || !timestamp || !parameter) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const reading = new FoundryParameterReading({
        value,
        timestamp: new Date(timestamp).toISOString(), // Store as string (ISO 8601 format)
        parameter,
      });
      
      await reading.save();
      await FoundryParameterController.calculateDailyStats(new Date(timestamp).toISOString()); // Fixed: Use string date format
      
      res.status(201).json(reading);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  static async getReadings(req, res) {
    try {
      // Parse the date from the URL parameter
      const date = new Date(req.params.date);
      
      // Ensure the date is valid
      if (isNaN(date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
  
      // Create start of day (00:00:00.000) and end of day (23:59:59.999) in UTC
      const startOfDay = new Date(date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      
      // Log the query range for debugging
      console.log('Query Range:', {
        startOfDay: startOfDay.toISOString(),
        endOfDay: endOfDay.toISOString()
      });
  
      // Query for readings within the date range
      const readings = await FoundryParameterReading.find({
        timestamp: {
          $gte: startOfDay.toISOString(),
          $lte: endOfDay.toISOString()
        }
      })
        .sort('timestamp')
        .populate('createdBy', 'name');
  
      // Log the count of readings found
      console.log('Readings found:', readings.length);
  
      // Return the results
      res.json(readings);
    } catch (error) {
      console.error('Error in getReadings:', error);
      res.status(500).json({ error: error.message });
    }
  }

  
  static async getDailyStats(req, res) {
    try {
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
  
      // Query using string comparison, assuming date is stored as a string (YYYY-MM-DD)
      const stats = await FoundryDailyStat.find({
        date: {
          $gte: startDate,   // Start date as string
          $lte: endDate      // End date as string
        }
      }).sort('date'); // Sorting by date string
  
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  
  
  static async importCSV(req, res) {
    try {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileContent = req.file.buffer.toString();
      const records = [];
      const processedDates = new Set();

      const parser = csv({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return new Promise((resolve, reject) => {
        parser.on('readable', function() {
          let record;
          while ((record = parser.read())) {
            records.push({
              parameter: record.parameter,
              value: parseFloat(record.value),
              timestamp: new Date(record.timestamp),
              createdBy: req.user?._id
            });
            processedDates.add(record.timestamp.split('T')[0]);
          }
        });

        parser.on('error', (err) => {
          reject(err);
        });

        parser.on('end', async () => {
          try {
            // Save all readings
            await FoundryParameterReading.insertMany(records);

            // Calculate daily stats for all affected dates
            const statsPromises = Array.from(processedDates).map(dateStr => 
              FoundryParameterController.calculateDailyStats(new Date(dateStr))
            );
            await Promise.all(statsPromises);

            res.status(201).json({
              message: `Successfully imported ${records.length} readings`,
              processedDates: Array.from(processedDates)
            });
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        parser.write(fileContent);
        parser.end();
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FoundryParameterController;