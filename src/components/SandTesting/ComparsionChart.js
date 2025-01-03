import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, Typography, Grid, Paper, Box, TextField
} from '@mui/material';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import BackButton from './BackButton';

const ComparisonChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState(['compactibility', 'moisture']);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5500/api/runner/runnerDataMoisture', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });

      if (response.data.success) {
        const processedData = response.data.data
          .filter(item => selectedTypes.includes(item.type))
          .flatMap(item => 
            item.readings.map(reading => ({
              date: item.date,
              reading: reading.reading,
              time: reading.time,
              type: item.type,
              lowerLimit: item.lowerLimit,
              upperLimit: item.upperLimit,
              formattedDate: `${format(new Date(item.date), 'MM/dd')} ${reading.time}`,
            }))
          );

        setData(processedData);
      } else {
        toast.error('Failed to fetch data: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <Paper elevation={3} style={{ padding: '15px', backgroundColor: 'white' }}>
          <Typography variant="subtitle2">{`Date: ${data.formattedDate}`}</Typography>
          <Typography variant="subtitle2">{`Type: ${data.type}`}</Typography>
          <Typography variant="subtitle2">{`Reading: ${data.reading}`}</Typography>
          <Typography variant="caption">
            {`Limits: ${data.lowerLimit} - ${data.upperLimit}`}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  const typeColors = {
    compactibility: '#5C6BC0',
    moisture: '#66BB6A'
  };

  const renderTypeCheckboxes = () => (
    <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
      {['compactibility', 'moisture'].map(type => (
        <Grid item key={type}>
          <Box display="flex" alignItems="center">
            <input
              type="checkbox"
              id={type}
              checked={selectedTypes.includes(type)}
              onChange={() => {
                setSelectedTypes(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
                );
              }}
            />
            <label 
              htmlFor={type} 
              style={{ 
                marginLeft: '8px', 
                color: typeColors[type],
                fontWeight: 'bold'
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (

    <Card 
      style={{ 
        maxWidth: '1200px', 
        margin: 'auto', 
        marginTop: '20px', 
        padding: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}
    >
   
      <CardContent>
      <BackButton/>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '30px', color: '#2c3e50' }}>
          AKP FOUNDRIES - PERFORMANCE COMPARISON
        </Typography>
        
        <Grid container spacing={2} justifyContent="center" style={{ marginBottom: '20px' }}>
          <Grid item xs={12} sm={5}>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Start Date"
              customInput={<TextField fullWidth variant="outlined" label="Start Date" />}
            />
          </Grid>
          <Grid item xs={12} sm={5}>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="End Date"
              customInput={<TextField fullWidth variant="outlined" label="End Date" />}
            />
          </Grid>
        </Grid>

        {renderTypeCheckboxes()}

        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedDate" 
              height={60} 
              angle={-45} 
              interval={0} 
              fontSize={10} 
              textAnchor="end"
              stroke="#2c3e50"
            />
            <YAxis label={{ value: 'Readings', angle: -90, position: 'insideLeft', fill: '#2c3e50' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              iconType="circle"
              iconSize={12}
              wrapperStyle={{
                color: '#2c3e50',
                fontWeight: 'bold'
              }}
            />
            
            {selectedTypes.map(type => (
              <Line
                key={type}
                type="monotone"
                dataKey={item => item.type === type ? item.reading : null}
                stroke={typeColors[type]}
                strokeWidth={3}
                name={type.charAt(0).toUpperCase() + type.slice(1)}
                dot={({ cx, cy, payload }) => (
                  payload.type === type ? (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={6} 
                      fill={typeColors[type]} 
                      stroke={typeColors[type]} 
                      strokeWidth={2}
                    />
                  ) : null
                )}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <ToastContainer />
    </Card>
  );
};

export default ComparisonChart;