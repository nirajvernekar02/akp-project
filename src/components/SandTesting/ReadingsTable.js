import React, { useEffect, useState, useCallback } from 'react';
import { Plus, FileDown, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Typography, IconButton, Tooltip, Box, Grid, TextField,
  ThemeProvider, createTheme, CssBaseline, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BackButton from './BackButton';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const MotionTableRow = motion(TableRow);
const MotionDialog = motion(Dialog);

const ReadingsTable = () => {
  const navigate = useNavigate();
  const [readingsData, setReadingsData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [readings, setReadings] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [lowerLimit, setLowerLimit] = useState('');

  const fetchReadings = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5500/api/reading/by-date/${selectedDate}`);
      setReadingsData(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setReadingsData(null);
      } else {
        toast.error('Error fetching readings');
      }
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchReadings();
  }, [fetchReadings]);

  const handleDelete = async (readingId) => {
    if (window.confirm('Are you sure you want to delete this reading?')) {
      try {
        await axios.delete(`http://localhost:5500/api/reading/delete/${readingId} `);
        toast.success('Reading deleted successfully');
        fetchReadings();
      } catch (error) {
        toast.error('Error deleting reading');
      }
    }
  };

  const handleExportToExcel = () => {
    if (readingsData) {
      const worksheet = XLSX.utils.json_to_sheet([readingsData]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Readings');
      XLSX.writeFile(workbook, `Readings_${selectedDate}.xlsx`);
    }
  };

  const handleImportClick = () => {
    navigate('/import');
  };

  const handleModalOpen = () => {
    if (readingsData) {
      setReadings(readingsData.readings ? readingsData.readings.join(', ') : '');
      setUpperLimit(readingsData.upperLimit || '');
      setLowerLimit(readingsData.lowerLimit || '');
    } else {
      setReadings('');
      setUpperLimit('');
      setLowerLimit('');
    }
    setAddModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!readings) {
        toast.error('Please enter readings');
        return;
      }

      const readingsArray = readings.split(',').map((reading) => parseFloat(reading.trim()));
      if (readingsArray.some(isNaN)) {
        toast.error('Please enter valid numeric readings');
        return;
      }

      const data = {
        readings: readingsArray,
        date: selectedDate,
        upperLimit: upperLimit ? parseFloat(upperLimit) : undefined,
        lowerLimit: lowerLimit ? parseFloat(lowerLimit) : undefined,
      };

      await axios.post('http://localhost:5500/api/reading/add-reading', data);
      toast.success('Readings added successfully');
      setAddModalOpen(false);
      fetchReadings();
    } catch (error) {
      toast.error('Error adding readings');
    }
  };

  const StatBox = ({ title, value }) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%', backgroundColor: '#f0f8ff' }}>
      <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ color: '#333' }}>
        {typeof value === 'number' ? value.toFixed(2) : value}
      </Typography>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
              SPC
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
              />
              <Tooltip title="Import Readings">
                <IconButton color="primary" onClick={handleImportClick}>
                  <Upload size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add New Reading">
                <IconButton color="primary" onClick={handleModalOpen}>
                  <Plus size={24} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export to Excel">
                <IconButton onClick={handleExportToExcel} disabled={!readingsData}>
                  <FileDown size={24} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </motion.div>

        <AnimatePresence>
          {!readingsData ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Typography variant="h6" align="center" color="textSecondary">
                No readings available for the selected date. Add a new reading to get started.
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Average" value={readingsData.average} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Standard Deviation" value={readingsData.standardDeviation} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="3-Sigma" value={readingsData.threeSigma} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="6-Sigma" value={readingsData.sixSigma} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Cp" value={readingsData.cp} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Cpk" value={readingsData.cpk} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Upper Limit" value={readingsData.upperLimit} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <StatBox title="Lower Limit" value={readingsData.lowerLimit} />
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ mb: 4, boxShadow: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f0f8ff' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reading No.</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Value</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readingsData.readings.map((value, index) => (
                      <MotionTableRow
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{value}</TableCell>
                        <TableCell>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(readingsData._id)}>
                              <Trash2 size={18} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </MotionTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <MotionDialog
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle>Add/Edit Readings</DialogTitle>
          <DialogContent>
            <TextField
              label="Readings (comma-separated)"
              fullWidth
              variant="outlined"
              value={readings}
              onChange={(e) => setReadings(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Upper Limit"
              fullWidth
              variant="outlined"
              type="number"
              value={upperLimit}
              onChange={(e) => setUpperLimit(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Lower Limit"
              fullWidth
              variant="outlined"
              type="number"
              value={lowerLimit}
              onChange={(e) => setLowerLimit(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} color="primary" variant="contained">
              Save
            </Button>
          </DialogActions>
        </MotionDialog>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </Container>
    </ThemeProvider>
  );
};

export default ReadingsTable;