import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  Paper,
  IconButton,
  Tooltip,
  Zoom,
  Fade,
  Alert,
  Snackbar,
  Container,
  CircularProgress
} from '@mui/material';
import {
  Science as ScienceIcon,
  Add as AddIcon,
  WaterDrop as WaterIcon,
  Speed as SpeedIcon,
  Compress as CompressIcon,
  Air as AirIcon,
  Close as CloseIcon,
  CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';
import BackButton from './BackButton';
import VisibilityIcon from "@mui/icons-material/Visibility";

const DashboardTile = ({ title, description, Icon, color, onClick }) => {
  const [elevated, setElevated] = useState(false);

  return (
    <Zoom in={true} style={{ transitionDelay: '150ms' }}>
      <Card
        sx={{
          minHeight: 220,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: '16px',
          backgroundColor: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: elevated ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: elevated ? 'translateY(-8px)' : 'none',
          '&:hover': {
            backgroundColor: `${color}08`,
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: color,
            transition: 'transform 0.3s ease-in-out',
            transform: elevated ? 'scaleX(1)' : 'scaleX(0)',
          },
        }}
        onClick={onClick}
        onMouseEnter={() => setElevated(true)}
        onMouseLeave={() => setElevated(false)}
      >
        <CardContent sx={{ width: '100%', p: 3 }}>
          <Icon sx={{ 
            fontSize: 72, 
            color,
            mb: 2,
            transition: 'transform 0.3s ease',
            transform: elevated ? 'scale(1.1)' : 'scale(1)',
          }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              mb: 1,
              color: 'text.primary',
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              opacity: 0.8,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Zoom>
  );
};

const AddReadingModal = ({ 
  open, 
  handleClose, 
  formData, 
  handleChange, 
  handleSubmit, 
  isLoading 
}) => {
  const theme = useTheme();

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: '20px',
            boxShadow: theme.shadows[24],
            p: 4,
            mx: 3,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" component="h2" fontWeight={700} mb={3}>
            Add New Reading
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Reading Value"
                  type="number"
                  name="reading"
                  value={formData.reading}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Enter measurement value"
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Measurement Type"
                  >
                    <MenuItem value="cgs">Green Compressive Strength (GCS)</MenuItem>
                    <MenuItem value="moisture">Moisture Content</MenuItem>
                    <MenuItem value="compactibility">Compactibility</MenuItem>
                    <MenuItem value="preamibility">Permeability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Remarks (Optional)"
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  height: 48,
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Saving...' : 'Save Reading'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

const AddCSVImportModal = ({ 
  open, 
  handleClose, 
  handleFileUpload,
  isLoading 
}) => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedType, setSelectedType] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    // Validate file type
    if (file && file.type !== 'text/csv') {
      setFileError('Please upload a valid CSV file');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    setFileError('');
  };

  const submitImport = (e) => {
    e.preventDefault();
    
    // Validate form submission
    if (!selectedFile) {
      setFileError('Please select a CSV file');
      return;
    }

    if (!selectedType) {
      setFileError('Please select a measurement type');
      return;
    }

    // Proceed with file upload
    handleFileUpload(selectedFile, selectedType);
  };

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <Paper
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: '20px',
            boxShadow: theme.shadows[24],
            p: 4,
            mx: 3,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant="h5" component="h2" fontWeight={700} mb={3}>
            Import CSV Data
          </Typography>
          
          <form onSubmit={submitImport}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  type="file"
                  label="CSV File"
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: '.csv' }}
                  onChange={handleFileChange}
                  fullWidth
                  required
                />
                {selectedFile && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Selected File: {selectedFile.name}
                  </Typography>
                )}
                {fileError && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {fileError}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    label="Measurement Type"
                  >
                    <MenuItem value="cgs">Green Compressive Strength (GCS)</MenuItem>
                    <MenuItem value="moisture">Moisture Content</MenuItem>
                    <MenuItem value="compactibility">Compactibility</MenuItem>
                    <MenuItem value="preamibility">Permeability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading || !selectedFile || !selectedType}
                sx={{
                  height: 48,
                  fontWeight: 600,
                }}
              >
                {isLoading ? 'Importing...' : 'Import CSV'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

const SandTesting = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [openCSVModal, setOpenCSVModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [readings, setReadings] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reading: '',
    type: '',
    remark: '',
  });

  // Fetch readings on component mount
  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setDataLoading(true);
        const response = await axios.get('http://localhost:5500/api/runner/runnerData');
        
        if (response.data && response.data.success) {
          setReadings(response.data.data);
        } else {
          throw new Error('Failed to fetch readings');
        }
      } catch (error) {
        console.error('Error fetching readings:', error);
        setSnackbarMessage(
          error.response?.data?.message || 'Failed to load readings'
        );
        setSnackbarSeverity('error');
        setOpenSnackbar(true);
      } finally {
        setDataLoading(false);
      }
    };

    fetchReadings();
  }, []);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({ date: '', time: '', reading: '', type: '', remark: '' });
  };

  const handleOpenCSV = () => setOpenCSVModal(true);
  const handleCloseCSV = () => setOpenCSVModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post('http://localhost:5500/api/runner/runnerData', formData);
      
      if (response.status === 200 && response.data.success) {
        // Optimistically update local state
        setReadings(prev => [...prev, response.data.data]);
        
        setSnackbarMessage('Reading added successfully!');
        setSnackbarSeverity('success');
        setOpenSnackbar(true);
        handleClose();
      } else {
        throw new Error('Failed to add reading');
      }
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.message || 'Failed to add reading. Please try again.'
      );
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file, type) => {
    setIsLoading(true);
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
  
    try {
      const response = await axios.post('http://localhost:5500/api/runner/runnerData/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Fetch updated readings after import
      const fetchResponse = await axios.get('http://localhost:5500/api/runner/runnerData');
      
      if (fetchResponse.data && fetchResponse.data.success) {
        setReadings(fetchResponse.data.data);
      }
      
      setSnackbarMessage(`CSV imported successfully (${response.data.importedCount} readings)`);
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseCSV();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to import CSV. Please try again.';
      setSnackbarMessage(errorMsg);
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };


  const handleNavigate = () => {
    navigate("/view-readings"); // Replace with your actual route
  };

  const tiles = [
    {
      title: "Green Compressive Strength",
      description: "Indicates the compactness and strength of green sand molds",
      Icon: CompressIcon,
      color: theme.palette.primary.main,
      path: '/runner'
    },
    {
      title: "Moisture Content",
      description: "Measures water content to ensure optimal mold strength",
      Icon: WaterIcon,
      color: theme.palette.secondary.main,
      path: '/moisture'
    },
    {
      title: "Compactibility",
      description: "Evaluates the mold's ability to maintain shape under pressure",
      Icon: SpeedIcon,
      color: theme.palette.success.main,
      path: '/compactability'
    },
    {
      title: "Permeability",
      description: "Measures gas escape capability during the casting process",
      Icon: AirIcon,
      color: theme.palette.warning.main,
      path: '/permeability'
    },
    {
      title: "Comparison",
      description: "Analyze and compare gas escape capabilities during the casting process.",
      Icon: CompareArrowsIcon, // Updated to a more relevant icon for comparison
      color: theme.palette.info.main, // Adjusted to a calmer blue tone for a better UI aesthetic
      path: '/comparison',

    }
    
  ];

  return (
    <Container maxWidth="xl">
      
      <BackButton/>
      <Box sx={{ flexGrow: 1, py: 4, mt: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
       
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Sand Testing Dashboard
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Add New Reading" arrow>
              <Button
                variant="contained"
                onClick={handleOpen}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                  boxShadow: theme.shadows[4],
                }}
              >
                New Reading
              </Button>
            </Tooltip>
    <Tooltip title="View Readings" arrow>
      <Button
        variant="contained"
        onClick={handleNavigate}
        startIcon={<VisibilityIcon />}
        sx={{
          borderRadius: "12px",
          px: 3,
          py: 1.5,
          boxShadow: (theme) => theme.shadows[4],
          backgroundColor: "primary.main",
          "&:hover": {
            backgroundColor: "primary.dark",
          },
        }}
      >
        View Readings
      </Button>
    </Tooltip>
            <Tooltip title="Import CSV" arrow>
              <Button
                variant="outlined"
                onClick={handleOpenCSV}
                startIcon={<ScienceIcon />}
                sx={{
                  borderRadius: '12px',
                  px: 3,
                  py: 1.5,
                }}
              >
                Import CSV
              </Button>
            </Tooltip>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {tiles.map((tile, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <DashboardTile
                {...tile}
                onClick={() => navigate(tile.path)}
              />
            </Grid>
          ))}
        </Grid>

        <AddReadingModal
          open={openModal}
          handleClose={handleClose}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <AddCSVImportModal
          open={openCSVModal}
          handleClose={handleCloseCSV}
          handleFileUpload={handleFileUpload}
          isLoading={isLoading}
        />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={() => setOpenSnackbar(false)} 
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            Reading added successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default SandTesting;