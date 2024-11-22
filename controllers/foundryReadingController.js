
// controllers/foundryReadingController.js
const FoundryReading = require('../models/foundryReadings');

exports.addReading = async (req, res) => {
  try {
    const { date, parameter, value } = req.body;
    
    // Convert date string to start of day
    const readingDate = new Date(date);
    readingDate.setHours(0, 0, 0, 0);

    // Find or create document for this date
    let dailyRecord = await FoundryReading.findOne({ date: readingDate });
    
    if (!dailyRecord) {
      dailyRecord = new FoundryReading({ date: readingDate });
    }

    // Add new reading to the specified parameter array
    const newReading = { value, timestamp: new Date() };
    dailyRecord[parameter].push(newReading);

    await dailyRecord.save();

    res.status(201).json({
      success: true,
      data: dailyRecord
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const { startDate, endDate, parameter } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const projection = parameter ? { date: 1, [parameter]: 1 } : {};
    const readings = await FoundryReading.find(query, projection).sort({ date: -1 });
    
    res.status(200).json({
      success: true,
      data: readings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAverages = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const aggregation = [
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $project: {
          date: 1,
          totalClay: { $avg: "$totalClay.value" },
          activeClay: { $avg: "$activeClay.value" },
          deadClay: { $avg: "$deadClay.value" },
          volatileMatter: { $avg: "$volatileMatter.value" },
          lossOnIgnition: { $avg: "$lossOnIgnition.value" },
          greenCompressiveStrength: { $avg: "$greenCompressiveStrength.value" },
          compactibility: { $avg: "$compactibility.value" },
          moisture: { $avg: "$moisture.value" },
          permeabilityNumber: { $avg: "$permeabilityNumber.value" },
          wetTensileStrength: { $avg: "$wetTensileStrength.value" },
          totalBentonite: { $sum: "$bentoniteAddition.value" },
          totalCoalDust: { $sum: "$coalDustAddition.value" },
          avgSandTemp: { $avg: "$sandTemperature.value" },
          totalDustCollected: { $sum: "$totalDustCollected.value" },
          readingsCount: {
            $sum: [
              { $size: "$totalClay" },
              { $size: "$activeClay" },
              // ... add other parameters as needed
            ]
          }
        }
      },
      {
        $sort: { date: 1 }
      }
    ];

    const averages = await FoundryReading.aggregate(aggregation);
    
    res.status(200).json({
      success: true,
      data: averages
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Add a new endpoint to get statistics for a specific parameter
exports.getParameterStats = async (req, res) => {
  try {
    const { date, parameter } = req.query;
    const queryDate = new Date(date);
    queryDate.setHours(0, 0, 0, 0);

    const reading = await FoundryReading.findOne({ date: queryDate });
    
    if (!reading || !reading[parameter]) {
      return res.status(404).json({
        success: false,
        error: 'No readings found for this date and parameter'
      });
    }

    const values = reading[parameter].map(r => r.value);
    const stats = {
      count: values.length,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      readings: reading[parameter]
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};