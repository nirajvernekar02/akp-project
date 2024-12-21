// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import * as XLSX from 'xlsx';
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   TextField,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   IconButton,
//   Grid,
//   Snackbar,
//   Alert,
//   CircularProgress
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Upload as UploadIcon,
//   Download as DownloadIcon,
//   Close as CloseIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon
// } from '@mui/icons-material';

// const API_BASE_URL = 'http://localhost:5500/api/foundry';

// const parameters = [
//   { id: 'totalClay', label: 'Total Clay %' },
//   { id: 'activeClay', label: 'Active Clay %' },
//   { id: 'deadClay', label: 'Dead Clay %' },
//   { id: 'volatileMatter', label: 'Volatile Matter %' },
//   { id: 'lossOnIgnition', label: 'Loss on Ignition %' },
//   { id: 'greenCompressiveStrength', label: 'Green Compressive Strength gm/cm²' },
//   { id: 'compactibility', label: 'Compactibility %' },
//   { id: 'moisture', label: 'Moisture %' },
//   { id: 'permeabilityNumber', label: 'Permeability Number' },
//   { id: 'wetTensileStrength', label: 'Wet Tensile Strength gm/cm²' },
//   { id: 'bentoniteAddition', label: 'Bentonite Addition Kg/%' },
//   { id: 'coalDustAddition', label: 'Coal Dust Addition Kg' },
//   { id: 'sandTemperature', label: 'Sand Temperature at Moulding Box' },
//   { id: 'newSandAdditionTime', label: 'New Sand Addition Timer (sec)' },
//   { id: 'newSandAdditionWeight', label: 'New Sand Addition Weight (kg)' },
//   { id: 'dailyDustCollected1', label: 'Daily Dust Collected 1 (Old) kg' },
//   { id: 'dailyDustCollected2', label: 'Daily Dust Collected 2 (New) kg' },
//   { id: 'totalDustCollected', label: 'Total Dust Collected kg' }
// ];
// const formatIndianDateTime = (date) =>
//   new Date(date).toLocaleString('en-IN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   });

// const formatIndianDate = (date) =>
//   new Date(date).toLocaleDateString('en-IN', {
//     day: '2-digit',
//     month: '2-digit',
//     year: 'numeric',
//   });

// const AddReadingDialog = ({ open, onClose, onAdd, loading }) => {
//   const [newReading, setNewReading] = useState({
//     parameter: '',
//     value: '',
//     timestamp: new Date().toISOString().slice(0, 16),
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onAdd(newReading);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <form onSubmit={handleSubmit}>
//         <DialogTitle>
//           <Box display="flex" justifyContent="space-between" alignItems="center">
//             Add New Reading
//             <IconButton onClick={onClose} size="small">
//               <CloseIcon />
//             </IconButton>
//           </Box>
//         </DialogTitle>
//         <DialogContent>
//           <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <FormControl fullWidth required>
//               <InputLabel>Parameter</InputLabel>
//               <Select
//                 value={newReading.parameter}
//                 onChange={(e) =>
//                   setNewReading((prev) => ({ ...prev, parameter: e.target.value }))
//                 }
//                 label="Parameter"
//               >
//                 {parameters.map((param) => (
//                   <MenuItem key={param.id} value={param.id}>
//                     {param.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               fullWidth
//               required
//               type="number"
//               label="Value"
//               value={newReading.value}
//               onChange={(e) =>
//                 setNewReading((prev) => ({ ...prev, value: e.target.value }))
//               }
//             />
//             <TextField
//               fullWidth
//               required
//               type="datetime-local"
//               label="Timestamp"
//               value={newReading.timestamp}
//               onChange={(e) =>
//                 setNewReading((prev) => ({ ...prev, timestamp: e.target.value }))
//               }
//               InputLabelProps={{ shrink: true }}
//             />
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             variant="contained"
//             disabled={loading || !newReading.parameter || !newReading.value}
//           >
//             {loading ? <CircularProgress size={24} /> : 'Add Reading'}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// const FoundryReadings = () => {
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [readings, setReadings] = useState([]);
//   const [stats, setStats] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [expandedParameters, setExpandedParameters] = useState([]);

//   const fetchData = async (date) => {
//     try {
//       setLoading(true);
//       const startDate = new Date(date);
//       startDate.setHours(0, 0, 0, 0);

//       const endDate = new Date(date);
//       endDate.setHours(23, 59, 59, 999);

//       const readingsResponse = await axios.get(`${API_BASE_URL}/readings/${date}`);
//       setReadings(readingsResponse.data);

//       const statsResponse = await axios.get(`${API_BASE_URL}/stats`, {
//         params: {
//           startDate: startDate.toISOString(),
//           endDate: endDate.toISOString(),
//         },
//       });
//       setStats(statsResponse.data);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(selectedDate);
//   }, [selectedDate]);

//   const handleAddReading = async (newReading) => {
//     try {
//       setLoading(true);
//       await axios.post(`${API_BASE_URL}/readings`, newReading);
//       setSuccess('Reading added successfully');
//       setIsModalOpen(false);
//       fetchData(selectedDate);
//     } catch (err) {
//       console.error('Error adding reading:', err);
//       setError('Failed to add reading');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       setLoading(true);
//       await axios.post(`${API_BASE_URL}/import-csv`, formData);
//       setSuccess('CSV imported successfully');
//       fetchData(selectedDate);
//     } catch (err) {
//       console.error('Error importing CSV:', err);
//       setError('Failed to import CSV');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExportToExcel = () => {
//     const exportData = readings.map((reading) => {
//       const parameter = parameters.find((p) => p.id === reading.parameter);
//       return {
//         Parameter: parameter?.label || reading.parameter,
//         Value: reading.value,
//         'Date & Time': formatIndianDateTime(reading.timestamp),
//       };
//     });

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(exportData);
//     XLSX.utils.book_append_sheet(wb, ws, 'Readings');
//     XLSX.writeFile(wb, `Foundry_Readings_${formatIndianDate(selectedDate)}.xlsx`);
//   };

//   const handleParameterExpand = (parameterId) => {
//     if (expandedParameters.includes(parameterId)) {
//       setExpandedParameters(expandedParameters.filter((id) => id !== parameterId));
//     } else {
//       setExpandedParameters([...expandedParameters, parameterId]);
//     }
//   };

// return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
//         Foundry Sand Testing Parameters
//       </Typography>
//       <Snackbar
//         open={!!error}
//         autoHideDuration={6000}
//         onClose={() => setError(null)}
//       >
//         <Alert severity="error" onClose={() => setError(null)}>
//           {error}
//         </Alert>
//       </Snackbar>
//       <Snackbar
//         open={!!success}
//         autoHideDuration={6000}
//         onClose={() => setSuccess(null)}
//       >
//         <Alert severity="success" onClose={() => setSuccess(null)}>
//           {success}
//         </Alert>
//       </Snackbar>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={4}>
//           <Card elevation={3}>
//             <CardContent>
//               <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
//                 <TextField
//                   type="date"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                   fullWidth
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <Button
//                   variant="contained"
//                   startIcon={<AddIcon />}
//                   onClick={() => setIsModalOpen(true)}
//                 >
//                   Add
//                 </Button>
//               </Box>
//               <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
//                 <Button
//                   variant="outlined"
//                   component="label"
//                   startIcon={<UploadIcon />}
//                   fullWidth
//                 >
//                   Import CSV
//                   <input
//                     type="file"
//                     hidden
//                     accept=".csv"
//                     onChange={handleFileUpload}
//                   />
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   startIcon={<DownloadIcon />}
//                   onClick={handleExportToExcel}
//                   fullWidth
//                 >
//                   Export to Excel
//                 </Button>
//               </Box>
//               <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
//                 {loading ? (
//                   <CircularProgress />
//                 ) : (
//                   stats.map((stat) => (
//                     <Box key={stat.parameter} sx={{ mb: 2 }}>
//                       <Box
//                         display="flex"
//                         justifyContent="space-between"
//                         alignItems="center"
//                         sx={{ cursor: 'pointer' }}
//                         onClick={() => handleParameterExpand(stat.parameter)}
//                       >
//                         <Typography variant="body1" fontWeight={500}>
//                           {stat.label}
//                         </Typography>
//                         {expandedParameters.includes(stat.parameter) ? (
//                           <ExpandLessIcon />
//                         ) : (
//                           <ExpandMoreIcon />
//                         )}
//                       </Box>
//                       {expandedParameters.includes(stat.parameter) && (
//                         <Box sx={{ pl: 2 }}>
//                           <Typography variant="body2">
//                             Min: {stat.min}
//                           </Typography>
//                           <Typography variant="body2">
//                             Max: {stat.max}
//                           </Typography>
//                           <Typography variant="body2">
//                             Avg: {stat.avg}
//                           </Typography>
//                         </Box>
//                       )}
//                     </Box>
//                   ))
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={8}>
//           <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Parameter</TableCell>
//                   <TableCell>Value</TableCell>
//                   <TableCell>Date & Time</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {readings.map((reading) => {
//                   const parameter = parameters.find((p) => p.id === reading.parameter);
//                   return (
//                     <TableRow key={reading.timestamp}>
//                       <TableCell>{parameter?.label || reading.parameter}</TableCell>
//                       <TableCell>{reading.value}</TableCell>
//                       <TableCell>{formatIndianDateTime(reading.timestamp)}</TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Grid>
//       </Grid>
//       <AddReadingDialog
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAdd={handleAddReading}
//         loading={loading}
//       />
//     </Box>
//   );
// };

// export default FoundryReadings;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
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
  Snackbar,
  Alert,
  CircularProgress,
  Checkbox
} from '@mui/material';
import {
  Add as AddIcon,
  Upload as UploadIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

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

const formatIndianDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// New Export Dialog Component
const ExportDialog = ({ open, onClose, onExport, parameters }) => {
  const [selectedParams, setSelectedParams] = useState([]);

  const handleToggleParameter = (paramId) => {
    if (selectedParams.includes(paramId)) {
      setSelectedParams(selectedParams.filter(id => id !== paramId));
    } else {
      setSelectedParams([...selectedParams, paramId]);
    }
  };

  const handleExport = () => {
    onExport(selectedParams);
    onClose();
    setSelectedParams([]); // Reset selection after export
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
    parameter: '',
    value: '',
    timestamp: new Date().toISOString().slice(0, 16)
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
              required
              type="number"
              label="Value"
              value={newReading.value}
              onChange={(e) => setNewReading(prev => ({ ...prev, value: e.target.value }))}
            />
            <TextField
              fullWidth
              required
              type="datetime-local"
              label="Timestamp"
              value={newReading.timestamp}
              onChange={(e) => setNewReading(prev => ({ ...prev, timestamp: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !newReading.parameter || !newReading.value}
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
  const [readings, setReadings] = useState([]);
  const [stats, setStats] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedParameters, setExpandedParameters] = useState([]);

  const fetchData = async (date) => {
    try {
      setLoading(true);
      
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const readingsResponse = await axios.get(`${API_BASE_URL}/readings/${date}`);
      setReadings(readingsResponse.data);
      
      const statsResponse = await axios.get(`${API_BASE_URL}/stats`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        }
      });
      setStats(statsResponse.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleAddReading = async (newReading) => {
    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/readings`, newReading);
      setSuccess('Reading added successfully');
      setIsModalOpen(false);
      fetchData(selectedDate);
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
      await axios.post(`${API_BASE_URL}/import-csv`, formData);
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
    const filteredReadings = readings.filter(reading => 
      selectedParams.includes(reading.parameter)
    );

    // Prepare data for export
    const exportData = filteredReadings.map(reading => {
      const parameter = parameters.find(p => p.id === reading.parameter);
      return {
        'Parameter': parameter?.label || reading.parameter,
        'Value': reading.value,
        'Date & Time': formatIndianDateTime(reading.timestamp)
      };
    });

    // Create workbook and add data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Readings');

    // Save file
    XLSX.writeFile(wb, `Foundry_Readings_${formatIndianDate(selectedDate)}.xlsx`);
  };

  const handleParameterExpand = (parameterId) => {
    if (expandedParameters.includes(parameterId)) {
      setExpandedParameters(expandedParameters.filter(id => id !== parameterId));
    } else {
      setExpandedParameters([...expandedParameters, parameterId]);
    }
  };

  const formatValue = (value) => {
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
        Foundry Sand Testing Parameters
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
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
                  <input
                    type="file"
                    hidden
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
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
                    const paramReadings = readings.filter(r => r.parameter === param.id);
                    if (paramReadings.length === 0) return null;

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
                        {isExpanded ? (
                          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
                            {paramReadings.map((reading, idx) => (
                              <Box
                                key={idx}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  mt: 1,p: 1,
                                  bgcolor: 'background.default',
                                  borderRadius: 1
                                }}
                              >
                                <Typography variant="body2">{formatValue(reading.value)}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatIndianDateTime(reading.timestamp)}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body2">{formatValue(paramReadings[0].value)}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatIndianDateTime(paramReadings[0].timestamp)}
                            </Typography>
                          </Box>
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
                Daily Statistics - {formatIndianDate(selectedDate)}
              </Typography>
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
                    {stats.map((stat) => {
                      const paramInfo = parameters.find(p => p.id === stat.parameter);
                      if (!paramInfo) return null;

                      return (
                        <TableRow key={stat.parameter}>
                          <TableCell>{paramInfo.label}</TableCell>
                          <TableCell align="right">{formatValue(stat.average)}</TableCell>
                          <TableCell align="right">{formatValue(stat.min)}</TableCell>
                          <TableCell align="right">{formatValue(stat.max)}</TableCell>
                          <TableCell align="right">{stat.count}</TableCell>
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