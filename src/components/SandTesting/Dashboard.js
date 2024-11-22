import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Divider,
  Chip,
  Container,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Sensors as SensorsIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  CloudUpload as CloudUploadIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [foundryLocation, setFoundryLocation] = useState('Belgaum');
  const [shift, setShift] = useState(1);
  const [sandTestingProgress, setSandTestingProgress] = useState(75);
  const [spcProgress, setSpcProgress] = useState(85);
  const [defectRate, setDefectRate] = useState(2.5);
  const [energyConsumption, setEnergyConsumption] = useState(12345);
  const [productionVolume, setProductionVolume] = useState(2500);
  const [onTimeDelivery, setOnTimeDelivery] = useState(92.3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const user = {
    name: "John Doe",
    designation: "Quality Engineer"
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth={false} disableGutters sx={{ bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#1976d2', color: '#fff', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            AKP Ferrocast Pvt Limited
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>{user.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {user.designation}
              </Typography>
            </Box>
            <IconButton color="inherit">
              <CloudUploadIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Sand Testing Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                bgcolor: '#42a5f5',
                color: 'white'
              }}
              onClick={() => handleCardClick('/sand-testing')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScienceIcon sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Sand Testing</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Progress</Typography>
                  <CircularProgress 
                    variant="determinate" 
                    value={sandTestingProgress} 
                    size={50}
                    thickness={5}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{sandTestingProgress}%</Typography>
                </Box>
              </CardContent>
              <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)' }} />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Shift</Typography>
                  <Chip 
                    label={`Shift ${shift}`}
                    color="primary"
                    size="medium"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* SPC Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                bgcolor: '#66bb6a',
                color: 'white'
              }}
              onClick={() => handleCardClick('/spcdas')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Statistical Process Control</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Progress</Typography>
                  <CircularProgress 
                    variant="determinate" 
                    value={spcProgress} 
                    size={50}
                    thickness={5}
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{spcProgress}%</Typography>
                </Box>
              </CardContent>
              <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.5)' }} />
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Defect Rate</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{defectRate}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Energy Consumption Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                bgcolor: '#ffa000',
                color: 'white'
              }}
              onClick={() => handleCardClick('/energy-consumption')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SensorsIcon sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Energy Consumption</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Consumption</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{energyConsumption} kWh</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Production Volume Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                bgcolor: '#9575cd',
                color: 'white'
              }}
              onClick={() => handleCardClick('/production-volume')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Production Volume</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Volume</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{productionVolume}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* On-Time Delivery Card */}
          <Grid item xs={12} md={6} lg={4}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': { boxShadow: 8, transform: 'scale(1.05)' },
                bgcolor: '#26a69a',
                color: 'white'
              }}
              onClick={() => handleCardClick('/on-time-delivery')}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ShowChartIcon sx={{ mr: 1, fontSize: 30 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>On-Time Delivery</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Rate</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{onTimeDelivery}%</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Additional Details */}
        <Box sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LocationIcon color="primary" />
                  <Typography variant="body1">{foundryLocation}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="body1">{currentDateTime.toLocaleString()}</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip 
                    label={`Shift ${shift}`}
                    color="primary"
                    size="medium"
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;