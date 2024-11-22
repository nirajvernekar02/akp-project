import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

const API_BASE_URL = 'http://localhost:5500/api/foundry';

const Dashboard = () => {
  const navigate = useNavigate();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newReading, setNewReading] = useState({
    parameter: '',
    value: '',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  const fetchReadings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/readings`);
      setReadings(response.data);
    } catch (err) {
      setError('Failed to fetch readings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, []);

  const handleAddReading = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/readings`, newReading);
      fetchReadings();
      setNewReading({
        parameter: '',
        value: '',
        timestamp: new Date().toISOString().slice(0, 16)
      });
    } catch (err) {
      setError('Failed to add reading');
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (page) => {
    navigate(page);
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#f0f4f8' }}>
      <Typography variant="h4" gutterBottom align="center" color="#1565c0" fontWeight={600}>
        Foundry Dashboard
      </Typography>

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
        </Snackbar>
      )}

      <Grid container spacing={4}>
        {/* First Card - Foundry Sand Testing Parameters */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              backgroundColor: '#1565c0',
              border: '1px solid #1565c0',
              borderRadius: '8px'
            }}
            onClick={() => handleCardClick('/foundry-reading')}
          >
            <CardContent>
              <Typography variant="h5" color="#fff" gutterBottom fontWeight={600}>
                Foundry Sand Testing Parameters
              </Typography>
              <Typography variant="body1" color="#e3f2fd">
                Click here to view the foundry sand testing parameters and add readings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Second Card - Result */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              backgroundColor: '#e3f2fd',
              border: '1px solid #90caf9',
              borderRadius: '8px'
            }}
            onClick={() => handleCardClick('/foundry-average')}
          >
            <CardContent>
              <Typography variant="h5" color="#1565c0" gutterBottom fontWeight={600}>
                Result
              </Typography>
              <Typography variant="body1" color="#424242">
                View the latest readings and analysis here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Reading Form */}
      <Paper sx={{ mt: 4, p: 4, backgroundColor: '#fff', boxShadow: 5, borderRadius: '8px' }}>
        <Typography variant="h5" color="#1565c0" gutterBottom fontWeight={600}>
          Add New Reading
        </Typography>

        <form onSubmit={handleAddReading}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Parameter</InputLabel>
                <Select
                  value={newReading.parameter}
                  onChange={(e) => setNewReading((prev) => ({ ...prev, parameter: e.target.value }))}
                  label="Parameter"
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1565c0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0d47a1'
                    }
                  }}
                >
                  {parameters.map((param) => (
                    <MenuItem key={param.id} value={param.id}>
                      {param.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Value"
                type="number"
                value={newReading.value}
                onChange={(e) => setNewReading((prev) => ({ ...prev, value: e.target.value }))}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#1565c0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#0d47a1'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0d47a1'
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Timestamp"
                type="datetime-local"
                value={newReading.timestamp}
                onChange={(e) => setNewReading((prev) => ({ ...prev, timestamp: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#1565c0'
                    },
                    '&:hover fieldset': {
                      borderColor: '#0d47a1'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0d47a1'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} mt={3} justifyContent="center">
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                sx={{
                  backgroundColor: '#1565c0',
                  '&:hover': { backgroundColor: '#0d47a1' },
                  color: '#fff',
                  borderRadius: '4px',
                  fontWeight: 600
                }}
                disabled={loading || !newReading.parameter || !newReading.value}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Reading'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

    </Box>
  );
};

export default Dashboard;