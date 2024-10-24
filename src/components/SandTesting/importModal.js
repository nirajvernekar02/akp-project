import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  LinearProgress,
  styled,
  Tooltip,
  IconButton,
  Grid,
  Container,
} from '@mui/material';
import { CloudUpload, CheckCircleOutline, ErrorOutline, GetApp } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
});

const VisuallyHiddenInput = styled('input')({
  display: 'none',
});

export default function CSVUpload() {
  const [file, setFile] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setFile(file);
    } else {
      setSnackbar({
        open: true,
        message: 'Please select a valid CSV file',
        severity: 'error',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !date) {
      setSnackbar({
        open: true,
        message: 'Please select both a file and a date',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('date', date.toISOString());

    try {
      await axios.post('http://localhost:5500/api/reading/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackbar({
        open: true,
        message: 'Upload successful!',
        severity: 'success',
      });
      setFile(null);
      setDate(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.error || 'Upload failed',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = `${process.env.PUBLIC_URL}/example.csv`;
    link.download = 'example.csv';
    link.click();
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box
          sx={{
            background: 'linear-gradient(135deg, #1976d2 30%, #ff4081 90%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 4,
          }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
            <Container maxWidth="md">
              <Box
                sx={{
                  mb: 4,
                  textAlign: 'center',
                  color: '#fff',
                  textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
                }}
              >
                <Typography variant="h3" component="h1" gutterBottom>
                  Upload CSV Readings
                </Typography>
                <Typography variant="subtitle1">
                  Effortlessly upload your CSV data to track readings and manage your data effectively.
                </Typography>
              </Box>

              <Card
                sx={{
                  boxShadow: 6,
                  borderRadius: 5,
                  overflow: 'hidden',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <DatePicker
                            label="Select Date"
                            value={date}
                            onChange={(newDate) => setDate(newDate)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{
                                  backgroundColor: '#fff',
                                  borderRadius: 2,
                                }}
                              />
                            )}
                          />
                        </motion.div>
                      </Grid>

                      <Grid item xs={12}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUpload />}
                            fullWidth
                            sx={{
                              height: 56,
                              textTransform: 'none',
                              backgroundColor: '#fff',
                              borderRadius: 2,
                              border: '2px dashed #ccc',
                              '&:hover': {
                                borderColor: '#1976d2',
                              },
                            }}
                          >
                            {file ? file.name : 'Choose CSV File'}
                            <VisuallyHiddenInput type="file" accept=".csv" onChange={handleFileChange} />
                          </Button>
                        </motion.div>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                            sx={{
                              height: 56,
                              textTransform: 'none',
                              fontWeight: 'bold',
                              borderRadius: 2,
                            }}
                          >
                            {loading ? 'Uploading...' : 'Upload Readings'}
                          </Button>
                        </motion.div>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Tooltip title="Download CSV Template" arrow>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={handleDownloadTemplate}
                              variant="contained"
                              color="secondary"
                              fullWidth
                              startIcon={<GetApp />}
                              sx={{
                                height: 56,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                borderRadius: 2,
                              }}
                            >
                              Download Template
                            </Button>
                          </motion.div>
                        </Tooltip>
                      </Grid>

                      {loading && (
                        <Grid item xs={12}>
                          <LinearProgress />
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </CardContent>
              </Card>
            </Container>
          </motion.div>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: '100%' }}
              icon={snackbar.severity === 'success' ? <CheckCircleOutline /> : <ErrorOutline />}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

