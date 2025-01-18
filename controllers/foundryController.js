// controllers/combinedReadingController.js
const CombinedReading = require('../models/runnerModel');
const csv = require('csv-parse');

class CombinedReadingController {
  static async addReading(req, res) {
    try {
      const { value, timestamp, type, remark } = req.body;
      
      // Validate required fields
      if (!value || !timestamp || !type) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const date = new Date(timestamp);
      date.setHours(0, 0, 0, 0);

      // Find or create combined reading for the date and type
      let combinedReading = await CombinedReading.findOne({ date, type });
      
      if (!combinedReading) {
        combinedReading = new CombinedReading({
          date,
          type,
          readings: []
        });
      }

      // Add new reading
      combinedReading.readings.push({
        reading: parseFloat(value),
        time: new Date(timestamp).toLocaleTimeString(),
        remark,
        createdBy: req.user?._id
      });

      // Calculate metrics
      combinedReading.calculateMetrics();
      
      await combinedReading.save();
      
      res.status(201).json(combinedReading);
    } catch (error) {
      console.error('Error in addReading:', error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getReadings(req, res) {
    try {
      const { date, type } = req.params;
      
      // Validate date
      const queryDate = new Date(date);
      if (isNaN(queryDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      queryDate.setHours(0, 0, 0, 0);

      // Find readings
      const reading = await CombinedReading.findOne({ 
        date: queryDate,
        type
      }).populate('readings.createdBy', 'name');

      if (!reading) {
        return res.status(404).json({ error: 'No readings found for the specified date and type' });
      }

      res.json(reading);
    } catch (error) {
      console.error('Error in getReadings:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailyStats(req, res) {
    try {
      const { startDate, endDate, type } = req.query;
  
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required' });
      }
  
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);

      const query = {
        date: {
          $gte: start,
          $lte: end
        }
      };

      if (type) {
        query.type = type;
      }
  
      const readings = await CombinedReading.find(query)
        .sort('date')
        .populate('readings.createdBy', 'name');
  
      res.json(readings);
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
      const records = new Map(); // Use Map to group readings by date and type

      const parser = csv({
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return new Promise((resolve, reject) => {
        parser.on('readable', function() {
          let record;
          while ((record = parser.read())) {
            const timestamp = new Date(record.timestamp);
            const date = new Date(timestamp.setHours(0, 0, 0, 0));
            const key = `${date.toISOString()}-${record.type}`;
            
            if (!records.has(key)) {
              records.set(key, {
                date,
                type: record.type,
                readings: []
              });
            }
            
            records.get(key).readings.push({
              reading: parseFloat(record.value),
              time: new Date(record.timestamp).toLocaleTimeString(),
              remark: record.remark,
              createdBy: req.user?._id
            });
          }
        });

        parser.on('error', (err) => {
          reject(err);
        });

        parser.on('end', async () => {
          try {
            const savePromises = Array.from(records.values()).map(async (record) => {
              let combinedReading = await CombinedReading.findOne({
                date: record.date,
                type: record.type
              });

              if (!combinedReading) {
                combinedReading = new CombinedReading(record);
              } else {
                combinedReading.readings.push(...record.readings);
              }

              combinedReading.calculateMetrics();
              return combinedReading.save();
            });

            await Promise.all(savePromises);

            res.status(201).json({
              message: `Successfully imported readings for ${records.size} date-type combinations`,
              processedCombinations: Array.from(records.keys())
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

  static async updateLimits(req, res) {
    try {
      const { type, upperLimit, lowerLimit } = req.body;

      if (!type || (!upperLimit && !lowerLimit)) {
        return res.status(400).json({ error: 'Type and at least one limit are required' });
      }

      // Update all readings of this type with new limits
      const readings = await CombinedReading.find({ type });
      
      const updatePromises = readings.map(reading => {
        if (upperLimit) reading.upperLimit = upperLimit;
        if (lowerLimit) reading.lowerLimit = lowerLimit;
        reading.calculateMetrics();
        return reading.save();
      });

      await Promise.all(updatePromises);

      res.json({ message: `Successfully updated limits for ${type}` });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CombinedReadingController;