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
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';
import dayjs from 'dayjs';

// DashboardTile component
const DashboardTile = ({ title, description, Icon, color, onClick }) => {
  return (
    <Card
      sx={{
        minHeight: 180,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)',
          transform: 'scale(1.05)',
        },
      }}
      onClick={onClick}
    >
      <CardContent>
        <Icon sx={{ fontSize: 60, color, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const SandTesting = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
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
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        Sand Testing Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 2 }}>
        Add New Reading
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Green Compressive Strength (GCS)"
            description="Indicates the compactness and strength of green sand."
            Icon={ScienceIcon}
            color={theme.palette.primary.main}
            onClick={() => navigate('/runner')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Moisture Content"
            description="Optimal moisture levels ensure good mold strength and prevent casting defects."
            Icon={ScienceIcon}
            color={theme.palette.secondary.main}
            onClick={() => navigate('/moisture')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Compactibility"
            description="Measures the mold’s capability to retain shape under pressure."
            Icon={ScienceIcon}
            color={theme.palette.success.main}
            onClick={() => navigate('/compactability')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Permeability"
            description="Determines the ability of gases to escape from the mold during casting."
            Icon={ScienceIcon}
            color={theme.palette.warning.main}
            onClick={() => navigate('/permeability')}
          />
        </Grid>
      </Grid>

      {/* Modal for adding new reading */}
      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            width: 400,
            bgcolor: 'background.paper',
            borderRadius: '12px',
            boxShadow: 24,
            p: 4,
            mx: 'auto',
            mt: '20vh',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add New Reading
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Time"
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Reading"
              type="number"
              name="reading"
              value={formData.reading}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <MenuItem value="GCS">Green Compressive Strength (GCS)</MenuItem>
                <MenuItem value="Moisture">Moisture Content</MenuItem>
                <MenuItem value="Compactibility">Compactibility</MenuItem>
                <MenuItem value="Permeability">Permeability</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default SandTesting;
