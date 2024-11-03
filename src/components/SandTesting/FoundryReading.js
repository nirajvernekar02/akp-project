import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon
} from 'lucide-react';

// Parameters list
const parameters = [
  { id: 'totalClay', label: 'Total Clay %' },
  { id: 'activeClay', label: 'Active Clay %' },
  { id: 'deadClay', label: 'Dead Clay %' },
  { id: 'volatileMatter', label: 'Volatile Matter %' },
  { id: 'lossOnIgnition', label: 'Loss on Ignition %' },
  { id: 'greenCompressiveStrength', label: 'Green Compressive Strength gm/cm²' },
  { id: 'compactibility', label: 'Compactibility %' },
  { id: 'moisture', label: 'Moisture %' },
  { id: 'permeabilityNumber', label: 'Permeability Number' },
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

const AddReadingDialog = ({ open, onClose, onAdd }) => {
  const [newReading, setNewReading] = useState({
    parameter: '',
    value: '',
    time: new Date().toTimeString().slice(0, 5)
  });

  const handleAdd = () => {
    onAdd(newReading);
    setNewReading({
      parameter: '',
      value: '',
      time: new Date().toTimeString().slice(0, 5)
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          <FormControl fullWidth>
            <InputLabel>Parameter</InputLabel>
            <Select
              value={newReading.parameter}
              onChange={(e) => setNewReading(prev => ({ ...prev, parameter: e.target.value }))}
              label="Parameter"
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
            type="number"
            label="Value"
            value={newReading.value}
            onChange={(e) => setNewReading(prev => ({ ...prev, value: e.target.value }))}
          />
          <TextField
            fullWidth
            type="time"
            label="Time"
            value={newReading.time}
            onChange={(e) => setNewReading(prev => ({ ...prev, time: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd} variant="contained" disabled={!newReading.parameter || !newReading.value}>
          Add Reading
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const FoundryReadings = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [readings, setReadings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReadings(selectedDate);
  }, [selectedDate]);

  const fetchReadings = async (date) => {
    // Simulated API call
    const simulatedData = parameters.map(param => ({
      parameter: param.id,
      readings: Array(Math.floor(Math.random() * 3) + 1).fill(null).map(() => ({
        value: (Math.random() * 100).toFixed(2),
        timestamp: new Date().toISOString()
      }))
    }));
    setReadings(simulatedData);
  };

  const handleAddReading = (newReading) => {
    const timestamp = `${selectedDate}T${newReading.time}`;
    setReadings(prev => {
      const updated = [...prev];
      const parameterIndex = updated.findIndex(p => p.parameter === newReading.parameter);
      if (parameterIndex >= 0) {
        updated[parameterIndex].readings.push({
          value: newReading.value,
          timestamp
        });
      }
      return updated;
    });
    setIsModalOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Left side - Date selection and readings list */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
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
              <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {readings.map(({ parameter, readings: paramReadings }) => (
                  <Paper key={parameter} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      {parameters.find(p => p.id === parameter)?.label}
                    </Typography>
                    {paramReadings.map((reading, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 1
                        }}
                      >
                        <Typography variant="body2">{reading.value}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(reading.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right side - Daily averages table */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell align="right">Average</TableCell>
                      <TableCell align="right">Min</TableCell>
                      <TableCell align="right">Max</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {readings.map(({ parameter, readings: paramReadings }) => {
                      const values = paramReadings.map(r => parseFloat(r.value));
                      const avg = values.reduce((a, b) => a + b, 0) / values.length;
                      return (
                        <TableRow key={parameter}>
                          <TableCell>
                            {parameters.find(p => p.id === parameter)?.label}
                          </TableCell>
                          <TableCell align="right">{avg.toFixed(2)}</TableCell>
                          <TableCell align="right">{Math.min(...values).toFixed(2)}</TableCell>
                          <TableCell align="right">{Math.max(...values).toFixed(2)}</TableCell>
                          <TableCell align="right">{values.length}</TableCell>
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
      />
    </Box>
  );
};

const FoundryAveragesView = () => {
  const [averages, setAverages] = useState([]);

  useEffect(() => {
    fetchAverages();
  }, []);

  const fetchAverages = async () => {
    // Simulated API call
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 9);

    const simulatedData = Array(10).fill(null).map((_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        ...parameters.reduce((acc, param) => ({
          ...acc,
          [param.id]: (Math.random() * 100).toFixed(2)
        }), {})
      };
    });

    setAverages(simulatedData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            10-Day Averages
          </Typography>
          <TableContainer sx={{ maxHeight: 'calc(100vh - 200px)' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  {parameters.map(param => (
                    <TableCell key={param.id} align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {param.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {averages.map((day) => (
                  <TableRow key={day.date}>
                    <TableCell>{day.date}</TableCell>
                    {parameters.map(param => (
                      <TableCell key={param.id} align="right">
                        {day[param.id]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export { FoundryReadings, FoundryAveragesView };