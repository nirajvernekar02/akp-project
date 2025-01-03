import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  Science,
  Speed,
  ThermostatAuto,
  Scale,
  Warning,
  CheckCircle,
  Info,
  Assessment,
  Timeline
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';
// Parameter groups with their configurations
const parameterGroups = {
  clay: {
    icon: <Science />,
    title: "Clay Parameters",
    color: "#1976d2",
    items: ['totalClay', 'activeClay', 'deadClay']
  },
  strength: {
    icon: <Speed />,
    title: "Strength Parameters",
    color: "#2e7d32",
    items: ['greenCompressiveStrength', 'wetTensileStrength', 'compactibility']
  },
  composition: {
    icon: <Scale />,
    title: "Composition Parameters",
    color: "#9c27b0",
    items: ['volatileMatter', 'lossOnIgnition', 'moisture']
  },
  temperature: {
    icon: <ThermostatAuto />,
    title: "Process Parameters",
    color: "#ed6c02",
    items: ['sandTemperature', 'newSandAdditionTime', 'newSandAdditionWeight']
  }
};

// Parameter limits configuration
const parameterLimits = {
  totalClay: { min: 7, max: 10, unit: '%' },
  activeClay: { min: 3.5, max: 5, unit: '%' },
  deadClay: { min: 3.5, max: 5, unit: '%' },
  volatileMatter: { min: 25, max: 30, unit: '%' },
  lossOnIgnition: { min: 4, max: 6, unit: '%' },
  greenCompressiveStrength: { min: 1200, max: 1800, unit: 'gm/cm²' },
  compactibility: { min: 40, max: 50, unit: '%' },
  moisture: { min: 3, max: 4.5, unit: '%' },
  permeabilityNumber: { min: 120, max: 180, unit: '' },
  wetTensileStrength: { min: 200, max: 300, unit: 'gm/cm²' },
  sandTemperature: { min: 38, max: 45, unit: '°C' },
  newSandAdditionTime: { min: 25, max: 35, unit: 'sec' },
  newSandAdditionWeight: { min: 140, max: 160, unit: 'kg' }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);
  const [statsData, setStatsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const endDate = new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0];
    
      const startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:5500/api/foundry/stats?startDate=${startDate}&endDate=${endDate}`);
      
      // Process and organize the data
      const processedData = response.data.reduce((acc, item) => {
        acc[item.parameter] = {
          average: item.average,
          min: item.min,
          max: item.max,
          date: new Date(item.date).toLocaleDateString()
        };
        return acc;
      }, {});
      
      setStatsData(processedData);
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (value, min, max) => {
    if (!value || value < min || value > max) return '#d32f2f';
    const midpoint = (max + min) / 2;
    const deviation = Math.abs(value - midpoint) / (max - min);
    return deviation > 0.3 ? '#ed6c02' : '#2e7d32';
  };

  const getStatusIcon = (value, min, max) => {
    if (!value || value < min || value > max) return <Warning color="error" />;
    const midpoint = (max + min) / 2;
    const deviation = Math.abs(value - midpoint) / (max - min);
    return deviation > 0.3 ? <Info color="warning" /> : <CheckCircle color="success" />;
  };

  const calculateProgress = (value, min, max) => {
    if (!value) return 0;
    return Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <BackButton/>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 600, mb: 4 }}>
        Foundry Process Control Dashboard
      </Typography>

      {/* Navigation Cards */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.02)', boxShadow: 5 },
              transition: 'transform 0.3s ease',
              backgroundColor: '#1976d2'
            }}
            onClick={() => navigate('/foundry-reading')}
          >
            <CardContent>
              <Typography variant="h5" sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment /> Foundry Readings
              </Typography>
              <Typography sx={{ color: '#e3f2fd', mt: 1 }}>
                View and manage detailed foundry readings
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { transform: 'scale(1.02)', boxShadow: 5 },
              transition: 'transform 0.3s ease',
              backgroundColor: '#2e7d32'
            }}
            onClick={() => navigate('/foundry-average')}
          >
            <CardContent>
              <Typography variant="h5" sx={{ color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline /> Analysis Results
              </Typography>
              <Typography sx={{ color: '#e8f5e9', mt: 1 }}>
                View statistical analysis and trends
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Parameters Display */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
          sx={{ mb: 2 }}
        >
          {Object.keys(parameterGroups).map((group, index) => (
            <Tab
              key={group}
              label={parameterGroups[group].title}
              icon={parameterGroups[group].icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(parameterGroups)[selectedTab][1].items.map((paramId) => {
            const paramData = statsData[paramId] || {};
            const limits = parameterLimits[paramId];
            
            return (
              <Grid item xs={12} md={4} key={paramId}>
                <Card sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, transition: 'transform 0.2s' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#333' }}>
                        {paramId.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Tooltip title={`Range: ${limits.min} - ${limits.max} ${limits.unit}`}>
                        <IconButton size="small">
                          {getStatusIcon(paramData.average, limits.min, limits.max)}
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h4" sx={{ fontWeight: 600, color: getStatusColor(paramData.average, limits.min, limits.max) }}>
                        {paramData.average?.toFixed(1) || 'N/A'}
                      </Typography>
                      <Typography variant="body1" sx={{ ml: 1, color: '#666' }}>
                        {limits.unit}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(paramData.average, limits.min, limits.max)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStatusColor(paramData.average, limits.min, limits.max),
                            borderRadius: 4
                          }
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Chip label={`Min: ${limits.min}`} size="small" sx={{ backgroundColor: '#f5f5f5' }} />
                      <Chip label={`Max: ${limits.max}`} size="small" sx={{ backgroundColor: '#f5f5f5' }} />
                    </Box>

                    {paramData.date && (
                      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 2, color: '#666' }}>
                        Last Updated: {paramData.date}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;