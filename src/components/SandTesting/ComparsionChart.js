import React, { useState, useEffect, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  Card, CardContent, Typography, Grid, Paper, Box, TextField, Button,
  IconButton, Tooltip as MuiTooltip
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import BackButton from './BackButton';

const ComparisonChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedTypes, setSelectedTypes] = useState(['compactibility', 'moisture']);
  const chartRef = useRef(null);

  const printStyles = `
    @media print {
      @page {
        size: landscape;
        margin: 10mm;
      }

      body {
        margin: 0;
        padding: 0;
        background: white;
      }

      .no-print {
        display: none !important;
      }

      .print-only {
        display: block !important;
      }

      .print-container {
        width: 297mm;
        min-height: 210mm;
        padding: 10mm;
        margin: 0 auto;
        box-sizing: border-box;
        background: white;
      }

      .print-chart {
        width: 277mm !important;
        height: 150mm !important;
        margin: 0 auto;
        page-break-inside: avoid;
      }

      .print-header {
        font-size: 18pt !important;
        margin-bottom: 10mm;
        text-align: center;
      }

      .print-info {
        font-size: 10pt !important;
        margin-bottom: 5mm;
      }

      .recharts-text.recharts-cartesian-axis-tick-value {
        font-size: 8pt !important;
      }

      .recharts-legend-item-text {
        font-size: 9pt !important;
      }
    }
  `;

  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = printStyles;
    document.head.appendChild(styleTag);
    return () => document.head.removeChild(styleTag);
  }, []);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://akp.niraj.site/api/runner/runnerDataMoisture', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }
      });

      if (response.data.success) {
        const dataPoints = new Map();

        response.data.data.forEach(item => {
          item.readings.forEach(reading => {
            const timeKey = `${format(new Date(item.date), 'MM/dd')} ${reading.time}`;
            
            if (!dataPoints.has(timeKey)) {
              dataPoints.set(timeKey, {
                formattedDate: timeKey,
                compactibility: null,
                moisture: null
              });
            }

            const point = dataPoints.get(timeKey);
            if (item.type === 'compactibility') {
              point.compactibility = reading.reading;
            } else if (item.type === 'moisture') {
              point.moisture = reading.reading;
            }
          });
        });

        const processedData = Array.from(dataPoints.values())
          .sort((a, b) => new Date(a.formattedDate) - new Date(b.formattedDate));

        setData(processedData);
      } else {
        toast.error('Failed to fetch data: Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    // Prepare data for export with only required fields
    const exportData = data.map(item => ({
      'Date & Time': item.formattedDate,
      'Compactibility': item.compactibility,
      'Moisture': item.moisture
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Performance Data");

    // Save file
    XLSX.writeFile(wb, `Performance_Data_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <Paper elevation={3} style={{ padding: '15px', backgroundColor: 'white' }}>
          <Typography variant="subtitle2">{`Date: ${label}`}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="subtitle2" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </Typography>
          ))}
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

  const PrintableChart = () => (
    <div className="print-only" style={{ display: 'none' }}>
      <div className="print-container">
        <div className="print-header">
          <Typography variant="h5">AKP FOUNDRIES - PERFORMANCE COMPARISON</Typography>
        </div>
        <div className="print-info">
          <Typography variant="body2">
            Date Range: {format(startDate, 'MM/dd/yyyy')} - {format(endDate, 'MM/dd/yyyy')}
          </Typography>
          <Typography variant="body2">
            Measurements: {selectedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}
          </Typography>
        </div>
        <div className="print-chart">
          <LineChart 
            width={720}
            height={500}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="formattedDate" 
              height={60} 
              angle={-45} 
              textAnchor="end"
              interval={0}
              tick={{ fontSize: 8 }}
            />
            <YAxis 
              label={{ 
                value: 'Readings', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle' }
              }} 
            />
            {selectedTypes.includes('compactibility') && (
              <Line
                type="monotone"
                dataKey="compactibility"
                stroke={typeColors.compactibility}
                strokeWidth={2}
                name="Compactibility"
                dot={{ r: 4 }}
                connectNulls={true}
              />
            )}
            {selectedTypes.includes('moisture') && (
              <Line
                type="monotone"
                dataKey="moisture"
                stroke={typeColors.moisture}
                strokeWidth={2}
                name="Moisture"
                dot={{ r: 4 }}
                connectNulls={true}
              />
            )}
            <Legend />
          </LineChart>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Card className="no-print" style={{ maxWidth: '1200px', margin: '20px auto', padding: '20px' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <BackButton />
            <Box>
              <MuiTooltip title="Export to Excel">
                <IconButton
                  color="primary"
                  onClick={handleExportExcel}
                  style={{ marginRight: '10px' }}
                >
                  <FileDownloadIcon />
                </IconButton>
              </MuiTooltip>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PrintIcon />}
                onClick={handlePrint}
              >
                Print Chart
              </Button>
            </Box>
          </Box>
          
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

          <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart 
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="formattedDate" 
                  height={60} 
                  angle={-45} 
                  textAnchor="end"
                  interval={0}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Readings', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconType="circle"
                  iconSize={12}
                  wrapperStyle={{
                    paddingTop: '20px',
                    color: '#2c3e50',
                    fontWeight: 'bold'
                  }}
                />
                
                {selectedTypes.includes('compactibility') && (
                  <Line
                    type="monotone"
                    dataKey="compactibility"
                    stroke={typeColors.compactibility}
                    strokeWidth={3}
                    name="Compactibility"
                    dot={{
                      r: 6,
                      fill: typeColors.compactibility,
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 8,
                      strokeWidth: 2
                    }}
                    connectNulls={true}
                  />
                )}
                
                {selectedTypes.includes('moisture') && (
                  <Line
                    type="monotone"
                    dataKey="moisture"
                    stroke={typeColors.moisture}
                    strokeWidth={3}
                    name="Moisture"
                    dot={{
                      r: 6,
                      fill: typeColors.moisture,
                      strokeWidth: 2
                    }}
                    activeDot={{
                      r: 8,
                      strokeWidth: 2
                    }}
                    connectNulls={true}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
        <ToastContainer />
      </Card>
      
      <PrintableChart />
    </>
  );
};

export default ComparisonChart;