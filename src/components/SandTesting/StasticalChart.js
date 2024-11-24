import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Card, CardContent, Typography } from '@mui/material';

const StatisticalParametersChart = ({ data }) => {
  // Process data to extract statistical parameters with date deduplication
  const processedData = data.reduce((acc, day) => {
    if (day.cp !== null && day.cpk !== null) {
      const date = new Date(day.date).toLocaleDateString();
      // If date already exists, update it (this keeps the latest entry)
      const existingIndex = acc.findIndex(item => item.date === date);
      const newEntry = {
        date,
        cp: Number(day.cp),
        cpk: Number(day.cpk),
        threeSigma: Number(day.threeSigma),
        sixSigma: Number(day.sixSigma),
        standardDeviation: Number(day.standardDeviation),
        average: Number(day.average),
        timestamp: new Date(day.date).getTime() // For sorting
      };

      if (existingIndex !== -1) {
        acc[existingIndex] = newEntry;
      } else {
        acc.push(newEntry);
      }
    }
    return acc;
  }, []);

  // Sort by date
  processedData.sort((a, b) => a.timestamp - b.timestamp);

  // Find min and max values for Y-axis scaling
  const allValues = processedData.flatMap(entry => [
    entry.cp,
    entry.cpk,
    entry.threeSigma / 1000,
    entry.sixSigma / 1000,
    entry.standardDeviation / 100,
    entry.average / 1000
  ].filter(val => val !== null && val !== undefined));

  const minValue = Math.floor(Math.min(...allValues) * 0.9);
  const maxValue = Math.ceil(Math.max(...allValues) * 1.1);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card 
          elevation={3}
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '8px',
            border: 'none'
          }}
        >
          <CardContent style={{ padding: '8px' }}>
            <Typography 
              variant="subtitle2" 
              style={{ 
                borderBottom: '1px solid #eee',
                paddingBottom: '4px',
                marginBottom: '4px',
                fontWeight: 600
              }}
            >
              Date: {label}
            </Typography>
            {payload.map((entry, index) => (
              <Typography
                key={index}
                variant="body2"
                style={{ 
                  color: entry.color,
                  margin: '3px 0',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ marginRight: '12px' }}>{entry.name}:</span>
                <span style={{ fontWeight: 500 }}>{Number(entry.value).toFixed(3)}</span>
              </Typography>
            ))}
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card 
      elevation={2}
      style={{ 
        width: '100%', 
        marginTop: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '12px'
      }}
    >
      <CardContent>
        <Typography 
          variant="h6" 
          style={{
            marginBottom: '20px',
            fontWeight: 600,
            color: '#1a237e'
          }}
        >
          Statistical Parameters Trend
        </Typography>
        <div style={{ height: '500px', width: '100%' }}>
          <ResponsiveContainer>
            <LineChart
              data={processedData}
              margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
                fontSize={12}
                tick={{ fill: '#666' }}
                tickMargin={25}
                stroke="#ccc"
              />
              <YAxis 
                domain={[minValue, maxValue]}
                tickFormatter={(value) => value.toFixed(2)}
                tick={{ fill: '#666' }}
                stroke="#ccc"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cp" 
                stroke="#3f51b5" 
                name="Cp"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="cpk" 
                stroke="#009688" 
                name="Cpk"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={(d) => d.threeSigma / 1000} 
                stroke="#ff9800" 
                name="3σ (thousands)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={(d) => d.sixSigma / 1000} 
                stroke="#f44336" 
                name="6σ (thousands)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={(d) => d.standardDeviation / 100} 
                stroke="#2196f3" 
                name="Std Dev (hundreds)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey={(d) => d.average / 1000} 
                stroke="#4caf50" 
                name="Average (thousands)"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatisticalParametersChart;