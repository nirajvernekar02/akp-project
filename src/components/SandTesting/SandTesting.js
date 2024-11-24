import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import {
  Science as ScienceIcon,
  Add as AddIcon,
  WaterDrop as WaterIcon,
  Speed as SpeedIcon,
  Compress as CompressIcon,
  Air as AirIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

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

const AddReadingModal = ({ open, handleClose, formData, handleChange, handleSubmit }) => {
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
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Measurement Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Measurement Type"
                  >
                    <MenuItem value="GCS">Green Compressive Strength (GCS)</MenuItem>
                    <MenuItem value="Moisture">Moisture Content</MenuItem>
                    <MenuItem value="Compactibility">Compactibility</MenuItem>
                    <MenuItem value="Permeability">Permeability</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  height: 48,
                  fontWeight: 600,
                }}
              >
                Save Reading
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reading: '',
    type: '',
  });

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => {
    setOpenModal(false);
    setFormData({ date: '', time: '', reading: '', type: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    handleClose();
    setOpenSnackbar(true);
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
    }
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ flexGrow: 1, py: 4, mt: 8 }}>
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