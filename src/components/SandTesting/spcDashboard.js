import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Fade,
  useTheme,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Science,
  Speed,
  ThermostatAuto,
  Scale,
  Assessment,
  Timeline,
  Analytics,
  ErrorOutline
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

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
    color: "#4caf50",
    items: ['cgs', 'wetTensileStrength', 'compactibility']
  },
  composition: {
    icon: <Scale />,
    title: "Composition Parameters",
    color: "#9c27b0",
    items: ['volatileMatter', 'lossOnIgnition', 'moisture', 'preamibility']
  },
  process: {
    icon: <ThermostatAuto />,
    title: "Process Parameters",
    color: "#ff9800",
    items: ['sandTemperature', 'bentoniteAddition', 'coalDustAddition', 'newSandAdditionTime', 'newSandAdditionWeight']
  }
};

const Dashboard = () => {
  const theme = useTheme();
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
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const endDate = tomorrow.toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      const response = await axios.get(
        `http://localhost:5500/api/foundry/stats?startDate=${today}&endDate=${endDate}`
      );
      
      const processedData = response.data.reduce((acc, item) => {
        acc[item.type] = {
          average: item.average,
          upperLimit: item.upperLimit,
          lowerLimit: item.lowerLimit,
          standardDeviation: item.standardDeviation,
          cp: item.cp,
          cpk: item.cpk,
          readings: item.readings,
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

  const getStatusColor = (value, upperLimit, lowerLimit) => {
    if (!value || !upperLimit || !lowerLimit) return theme.palette.grey[400];
    if (value < lowerLimit || value > upperLimit) return theme.palette.error.main;
    return theme.palette.success.main;
  };

  const NavigationCard = ({ title, icon, color, onClick }) => (
    <Card
      sx={{
        cursor: 'pointer',
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        transition: 'transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 1 }}>
          {title === 'Foundry Readings' ? 'View and manage detailed readings' : 'Explore trends and analytics'}
        </Typography>
      </CardContent>
    </Card>
  );

  const MetricCard = ({ paramId, data, groupColor }) => {
    const paramName = paramId.replace(/([A-Z])/g, ' $1').trim();
    const hasData = data && data.average !== undefined;

    return (
      <Card 
        sx={{
          height: '100%',
          minHeight: '200px',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 3
          },
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
      >
        <Box 
          sx={{ 
            height: '4px',
            backgroundColor: groupColor,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }} 
        />
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 500 }}>
              {paramName}
            </Typography>
            <IconButton size="small">
              <Analytics sx={{ color: groupColor }} />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700,
                  color: hasData ? getStatusColor(data.average, data.upperLimit, data.lowerLimit) : theme.palette.grey[400]
                }}
              >
                {hasData ? data.average.toFixed(1) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                avg
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Std Dev</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {hasData && data.standardDeviation ? data.standardDeviation.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">Cpk</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {hasData && data.cpk ? data.cpk.toFixed(2) : 'N/A'}
                </Typography>
              </Grid>
            </Grid>

            {hasData && (data.upperLimit || data.lowerLimit) && (
              <Typography variant="caption" color="text.secondary">
                Limits: {data.lowerLimit || 'N/A'} - {data.upperLimit || 'N/A'}
              </Typography>
            )}
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
            Last Updated: {hasData ? data.date : 'No data available'}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ p: 3, backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      <BackButton />
      
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 700,
          mb: 4
        }}
      >
        Foundry Process Control Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <NavigationCard
            title="Foundry Readings"
            icon={<Assessment />}
            color={theme.palette.primary.main}
            onClick={() => navigate('/foundry-reading')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <NavigationCard
            title="Analysis Results"
            icon={<Timeline />}
            color={theme.palette.success.main}
            onClick={() => navigate('/foundry-average')}
          />
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ mb: 4, borderRadius: 1 }}>
        <Tabs
          value={selectedTab}
          onChange={(e, newValue) => setSelectedTab(newValue)}
          centered
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontWeight: 500
            }
          }}
        >
          {Object.keys(parameterGroups).map((group) => (
            <Tab
              key={group}
              label={parameterGroups[group].title}
              icon={parameterGroups[group].icon}
              iconPosition="start"
              sx={{
                color: parameterGroups[group].color,
                '&.Mui-selected': {
                  color: parameterGroups[group].color
                }
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <Fade in={!loading}>
          <Grid container spacing={3}>
            {Object.entries(parameterGroups)[selectedTab][1].items.map((paramId) => (
              <Grid item xs={12} sm={6} md={4} key={paramId}>
                <MetricCard
                  paramId={paramId}
                  data={statsData[paramId]}
                  groupColor={Object.entries(parameterGroups)[selectedTab][1].color}
                />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Dashboard;