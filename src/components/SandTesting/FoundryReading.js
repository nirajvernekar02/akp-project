import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { Card, CardContent, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, MenuItem, Select, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, Typography,
  IconButton, Grid, Snackbar, Alert, CircularProgress, Checkbox, Box, Button } from '@mui/material';
import { Add as AddIcon, Upload as UploadIcon, Download as DownloadIcon,
  Close as CloseIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import BackButton from './BackButton';

const API_BASE_URL = 'http://localhost:5500/api/foundry';

const parameters = [
  { id: 'moisture', label: 'Moisture %', limits: { lower: 3.50, upper: 4.50 } },
  { id: 'preamibility', label: 'Permeability Number', limits: { lower: 105, upper: 165 } },
  { id: 'compactibility', label: 'Compactibility %', limits: { lower: 36, upper: 48 } },
  { id: 'cgs', label: 'Green Compressive Strength gm/cm²', limits: { lower: 1100, upper: 1500 } },
  { id: 'totalClay', label: 'Total Clay %' },
  { id: 'activeClay', label: 'Active Clay %' },
  { id: 'deadClay', label: 'Dead Clay %' },
  { id: 'volatileMatter', label: 'Volatile Matter %' },
  { id: 'lossOnIgnition', label: 'Loss on Ignition %' },
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

const formatIndianDateTime = (date) => {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Export Dialog Component
const ExportDialog = ({ open, onClose, onExport, parameters }) => {
  const [selectedParams, setSelectedParams] = useState([]);

  const handleToggleParameter = (paramId) => {
    setSelectedParams(prev => 
      prev.includes(paramId) 
        ? prev.filter(id => id !== paramId)
        : [...prev, paramId]
    );
  };

  const handleExport = () => {
    onExport(selectedParams);
    onClose();
    setSelectedParams([]);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          Select Parameters to Export
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {parameters.map(param => (
            <FormControl key={param.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={selectedParams.includes(param.id)}
                  onChange={() => handleToggleParameter(param.id)}
                />
                <Typography>{param.label}</Typography>
              </Box>
            </FormControl>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleExport}
          disabled={selectedParams.length === 0}
        >
          Export Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AddReadingDialog = ({ open, onClose, onAdd, loading }) => {
  const [newReading, setNewReading] = useState({
    type: '',
    value: '',
    timestamp: new Date().toISOString().slice(0, 16),
    remark: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newReading);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add New Reading
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Parameter Type</InputLabel>
              <Select
                value={newReading.type}
                onChange={(e) => setNewReading(prev => ({ ...prev, type: e.target.value }))}
                label="Parameter Type"
              >
                {parameters.map(param => (
                  <MenuItem key={param.id} value={param.id}>
                    {param.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              type="number"
              label="Value"
              value={newReading.value}
              onChange={(e) => setNewReading(prev => ({ ...prev, value: e.target.value }))}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="Timestamp"
              value={newReading.timestamp}
              onChange={(e) => setNewReading(prev => ({ ...prev, timestamp: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Remark"
              value={newReading.remark}
              onChange={(e) => setNewReading(prev => ({ ...prev, remark: e.target.value }))}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newReading.type || !newReading.value}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Reading'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const FoundryReadings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [readings, setReadings] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedParameters, setExpandedParameters] = useState([]);

  const fetchData = async (date) => {
    try {
      setLoading(true);
      const fetchPromises = parameters.map(param => 
        axios.get(`${API_BASE_URL}/readings/${date}/${param.id}`)
          .then(response => ({ type: param.id, data: response.data }))
          .catch(() => ({ type: param.id, data: null }))
      );
      
      const results = await Promise.all(fetchPromises);
      const readingsData = {};
      results.forEach(({ type, data }) => {
        if (data) readingsData[type] = data;
      });
      
      setReadings(readingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchData(selectedDate);
    }
  }, [selectedDate]);

  const handleAddReading = async (newReading) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/readings`, newReading);
      setSuccess('Reading added successfully');
      setIsModalOpen(false);
      await fetchData(selectedDate);
    } catch (err) {
      console.error('Error adding reading:', err);
      setError('Failed to add reading');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/import`, formData);
      setSuccess('CSV imported successfully');
      fetchData(selectedDate);
    } catch (err) {
      console.error('Error importing CSV:', err);
      setError('Failed to import CSV');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = (selectedParams) => {
    // Filter readings based on selected parameters
    const exportData = [];
    
    selectedParams.forEach(paramId => {
      const paramData = readings[paramId];
      if (paramData?.readings) {
        const paramInfo = parameters.find(p => p.id === paramId);
        paramData.readings.forEach(reading => {
          exportData.push({
            'Parameter': paramInfo.label,
            'Value': reading.reading.toFixed(2),
            'Date & Time': reading.time,
            'Remark': reading.remark || ''
          });
        });
      }
    });

    // Create workbook and add data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Readings');

    // Save file
    XLSX.writeFile(wb, `Foundry_Readings_${selectedDate}.xlsx`);
  };

  const handleParameterExpand = (parameterId) => {
    setExpandedParameters(prev => 
      prev.includes(parameterId) 
        ? prev.filter(id => id !== parameterId)
        : [...prev, parameterId]
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <BackButton />
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Foundry Sand Testing Parameters
      </Typography>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Import CSV
                  <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={() => setIsExportDialogOpen(true)}
                  fullWidth
                >
                  Export Excel
                </Button>
              </Box>

              <Box sx={{ maxHeight: 'calc(100vh - 250px)', overflow: 'auto' }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  parameters.map(param => {
                    const readingData = readings[param.id];
                    if (!readingData?.readings?.length) return null;
                    const isExpanded = expandedParameters.includes(param.id);
                    return (
                      <Paper key={param.id} sx={{ p: 2, mb: 2 }} elevation={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" color="primary">
                            {param.label}
                          </Typography>
                          <IconButton size="small" onClick={() => handleParameterExpand(param.id)}>
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        
                        {isExpanded && (
                          <>
                            <Box sx={{ mt: 1, mb: 2 }}>
                              <Typography variant="caption" color="text.secondary">
                                Average: {readingData.average?.toFixed(2)} | 
                                Cp: {readingData.cp?.toFixed(2)} | 
                                Cpk: {readingData.cpk?.toFixed(2)}
                              </Typography>
                            </Box>
                            <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                              {readingData.readings.map((reading, idx) => (
                                <Box
                                key={idx}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mt: 1,
                                  p: 1,
                                  bgcolor: 'background.default',
                                  borderRadius: 1
                                }}
                              >
                                <Typography variant="body2">{reading.reading.toFixed(2)}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {reading.time}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </>
                      )}
                    </Paper>
                  );
                })
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Process Capability Analysis
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Parameter</TableCell>
                    <TableCell align="right">Average</TableCell>
                    <TableCell align="right">Std Dev</TableCell>
                    <TableCell align="right">Cp</TableCell>
                    <TableCell align="right">Cpk</TableCell>
                    <TableCell align="right">Count</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parameters.map(param => {
                    const data = readings[param.id];
                    if (!data?.readings?.length) return null;
                    return (
                      <TableRow key={param.id}>
                        <TableCell>{param.label}</TableCell>
                        <TableCell align="right">{data.average?.toFixed(2)}</TableCell>
                        <TableCell align="right">{data.standardDeviation?.toFixed(2)}</TableCell>
                        <TableCell align="right">{data.cp?.toFixed(2)}</TableCell>
                        <TableCell align="right">{data.cpk?.toFixed(2)}</TableCell>
                        <TableCell align="right">{data.readings.length}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    <AddReadingDialog
      open={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onAdd={handleAddReading}
      loading={loading}
    />

    <ExportDialog
      open={isExportDialogOpen}
      onClose={() => setIsExportDialogOpen(false)}
      onExport={handleExportToExcel}
      parameters={parameters}
    />
  </Box>
);
};

export default FoundryReadings;