import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import BackButton from './BackButton';

const API_BASE_URL = 'http://localhost:5500/api/foundry';

const parameters = [
  { id: 'totalClay', label: 'Total Clay %' },
  { id: 'activeClay', label: 'Active Clay %' },
  { id: 'deadClay', label: 'Dead Clay %' },
  { id: 'volatileMatter', label: 'Volatile Matter %' },
  { id: 'lossOnIgnition', label: 'Loss on Ignition %' },
  { id: 'greenCompressiveStrength', label: 'Green Compressive Strength gm/cm²' },
  { id: 'compactibility', label: 'Compactibility %' },
  { id: 'moisture', label: 'Moisture %' },
  { id: 'preamibility', label: 'Permeability Number' },
  { id: 'wetTensileStrength', label: 'Wet Tensile Strength gm/cm²' },
  { id: 'bentoniteAddition', label: 'Bentonite Addition Kg/%' },
  { id: 'coalDustAddition', label: 'Coal Dust Addition Kg' },
  { id: 'sandTemperature', label: 'Sand Temperature at Moulding Box' },
  { id: 'newSandAdditionTime', label: 'New Sand Addition Timer (sec)' },
  { id: 'newSandAdditionWeight', label: 'New Sand Addition Weight (kg)' },
  { id: 'dailyDustCollected1', label: 'Daily Dust Collected 1 (Old) kg' },
  { id: 'dailyDustCollected2', label: 'Daily Dust Collected 2 (New) kg' },
  { id: 'totalDustCollected', label: 'Total Dust Collected kg' }
];

// Helper function to add one day to a date and format it
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1); // Add one day
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const FoundryAverages = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0],
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]
  });
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const processData = (data) => {
    const groupedData = {};
    
    data.forEach(item => {
      const dateStr = new Date(item.date).toISOString().split('T')[0];
      
      if (!groupedData[dateStr]) {
        groupedData[dateStr] = {};
      }
      
      groupedData[dateStr][item.type] = {
        average: item.average,
        readings: item.readings,
        upperLimit: item.upperLimit,
        lowerLimit: item.lowerLimit
      };
    });

    return Object.entries(groupedData)
      .map(([date, values]) => ({
        date,
        ...values
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/stats`, {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });

      const processedData = processData(response.data);
      setStats(processedData);
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateChange = (field) => (event) => {
    setDateRange(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const exportToExcel = () => {
    const excelData = stats.map(day => {
      const row = {
        'Date': formatDisplayDate(day.date), // Use the adjusted date for export
      };
      
      parameters.forEach(param => {
        const paramData = day[param.id];
        if (paramData) {
          row[param.label] = paramData.average.toFixed(2);
          row[`${param.label} Readings`] = paramData.readings
            .map(r => `${r.reading.toFixed(2)} (${r.time}${r.remark ? `, ${r.remark}` : ''})`)
            .join('; ');
        } else {
          row[param.label] = 'N/A';
          row[`${param.label} Readings`] = 'N/A';
        }
      });
      
      return row;
    });
  
    const headers = ['Date', ...parameters.flatMap(p => [p.label, `${p.label} Readings`])];
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Foundry_Report_${formatDisplayDate(dateRange.startDate)}_to_${formatDisplayDate(dateRange.endDate)}.csv`;
    link.click();
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <BackButton />
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)} variant="filled">
          {error}
        </Alert>
      </Snackbar>

      <Card elevation={3}>
        <CardContent>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={6}>
                <Typography variant="h4" component="h1" gutterBottom>
                  Sand Properties Analysis Report
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Daily averages and measurements
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <Tooltip title="Export to Excel">
                    <Button
                      variant="outlined"
                      startIcon={<FileDownloadIcon />}
                      onClick={exportToExcel}
                      disabled={loading || stats.length === 0}
                    >
                      {!isMobile && "Export"}
                    </Button>
                  </Tooltip>
                  <Tooltip title="Refresh Data">
                    <Button
                      variant="contained"
                      startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
                      onClick={fetchStats}
                      disabled={loading}
                    >
                      {!isMobile && "Refresh"}
                    </Button>
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Date Range Selector */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={handleDateChange('startDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={handleDateChange('endDate')}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          {/* Data Table */}
          <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)' }}>
              <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        fontWeight: 'bold',
                        position: 'sticky',
                        left: 0,
                        zIndex: theme.zIndex.appBar + 1
                      }}
                    >
                      Date
                    </TableCell>
                    {parameters.map(param => (
                      <TableCell
                        key={param.id}
                        align="right"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {param.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stats.map((day) => (
                    <TableRow key={day.date} hover>
                      <TableCell
                        sx={{
                          position: 'sticky',
                          left: 0,
                          backgroundColor: 'background.paper',
                          fontWeight: 'medium'
                        }}
                      >
                        {formatDisplayDate(day.date)} {/* This will show date as one day ahead */}
                      </TableCell>
                      {parameters.map(param => {
                        const paramData = day[param.id];
                        return (
                          <TableCell
                            key={param.id}
                            align="right"
                            sx={{
                              backgroundColor: paramData ? 'transparent' : 'action.hover',
                              color: paramData ? 'text.primary' : 'text.secondary'
                            }}
                          >
                            {paramData ? (
                              <Tooltip title={
                                paramData.readings.map(r => 
                                  `${r.time}: ${r.reading.toFixed(2)}${r.remark ? ` (${r.remark})` : ''}`
                                ).join('\n')
                              }>
                                <span>{paramData.average.toFixed(2)}</span>
                              </Tooltip>
                            ) : 'N/A'}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Empty State */}
            {!loading && stats.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  No data available for the selected date range
                </Typography>
              </Box>
            )}
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FoundryAverages;