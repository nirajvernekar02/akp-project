import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  Typography,
  Grid,
} from '@mui/material';

const StatisticalParametersChart = ({ startDate, endDate, data }) => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/runner/metrics', {
          params: {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            type: 'cgs',
          },
        });

        if (response.data.summary) {
          setMetrics(response.data.summary);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  const processedData = data.reduce((acc, day) => {
    if (day.cp !== null && day.cpk !== null) {
      const date = new Date(day.date).toLocaleDateString();
      const existingIndex = acc.findIndex((item) => item.date === date);
      const newEntry = {
        date,
        cp: Number(day.cp),
        cpk: Number(day.cpk),
        threeSigma: Number(day.threeSigma),
        sixSigma: Number(day.sixSigma),
        standardDeviation: Number(day.standardDeviation),
        average: Number(day.average),
        timestamp: new Date(day.date).getTime(),
      };

      if (existingIndex !== -1) {
        acc[existingIndex] = newEntry;
      } else {
        acc.push(newEntry);
      }
    }
    return acc;
  }, []);

  const allValues = processedData.flatMap((entry) => [
    entry.cp,
    entry.cpk,
    entry.threeSigma / 1000,
    entry.sixSigma / 1000,
    entry.standardDeviation / 100,
    entry.average / 1000,
  ].filter((val) => val !== null && val !== undefined));

  const minValue = Math.floor(Math.min(...allValues) * 0.9);
  const maxValue = Math.ceil(Math.max(...allValues) * 1.1);

  const SummaryBox = ({ title, value, color = '#3f51b5' }) => (
    <Card
      elevation={3}
      style={{
        backgroundColor: color,
        color: 'white',
        padding: '10px',
        textAlign: 'center',
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
        {title}
      </Typography>
      <Typography variant="body1">
        {typeof value === 'number' ? value.toFixed(3) : value}
      </Typography>
    </Card>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#fff', border: '1px solid #ccc', padding: '10px' }}>
          <p>{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(3)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card elevation={2} style={{ width: '100%', marginTop: '20px' }}>
      <CardContent>
        {/* Summary Metrics Boxes */}
        {metrics && (
          <Grid container spacing={2} style={{ marginBottom: '20px' }}>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Average" value={metrics.average} color="#4caf50" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Std Deviation" value={metrics.standardDeviation} color="#2196f3" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Cp" value={metrics.cp} color="#3f51b5" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Cpk" value={metrics.cpk} color="#009688" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="3σ" value={metrics.threeSigma} color="#ff9800" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="6σ" value={metrics.sixSigma} color="#f44336" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Upper Limit" value={metrics.limits.upper} color="#673ab7" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <SummaryBox title="Lower Limit" value={metrics.limits.lower} color="#9c27b0" />
            </Grid>
          </Grid>
        )}

        {/* Chart Section */}
        {/* <Typography
          variant="h6"
          style={{
            marginBottom: '20px',
            fontWeight: 600,
            color: '#1a237e',
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
                  fontSize: '12px',
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
        </div> */}
      </CardContent>
    </Card>
  );
};

export default StatisticalParametersChart;
