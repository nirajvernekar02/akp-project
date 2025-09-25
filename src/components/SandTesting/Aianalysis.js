import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  Alert,
  Card,
  CardContent,
  LinearProgress,
  Button,
  useTheme,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Fade,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Timeline,
  Insights,
  Science,
  PriorityHigh,
  Lightbulb,
  Psychology as PsychologyIcon,
  Analytics,
  BarChart,
  BubbleChart,
  Article,
  Print,
  Share,
  Download,
  Compress as CompressIcon,
  Assignment,
  ErrorOutline,
  ArrowForward,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import BackButton from './BackButton';

// Hardcoded sample readings
const sampleReadings = [
  { date: "20-02-2025", time: "09:30", reading: 1130, remark: "Normal range" },
  { date: "20-02-2025", time: "14:45", reading: 1175, remark: "Slightly increased" },
  { date: "21-02-2025", time: "09:00", reading: 1135, remark: "Normal" },
  { date: "21-02-2025", time: "12:00", reading: 1400, remark: "High" },
  { date: "22-02-2025", time: "08:45", reading: 1380, remark: "Above normal range" },
  { date: "22-02-2025", time: "15:30", reading: 1245, remark: "Returned to moderate level" },
  { date: "23-02-2025", time: "10:00", reading: 1155, remark: "Within acceptable range" },
  { date: "23-02-2025", time: "16:15", reading: 1190, remark: "Slight increase after noon" },
  { date: "24-02-2025", time: "09:15", reading: 1430, remark: "Significant spike checking equipment" },
  { date: "24-02-2025", time: "13:00", reading: 1480, remark: "Peak reading requires investigation" },
  { date: "25-02-2025", time: "08:30", reading: 1390, remark: "High but decreased from yesterday" },
  { date: "25-02-2025", time: "14:00", reading: 1320, remark: "Gradually normalizing" },
  { date: "26-02-2025", time: "10:30", reading: 1250, remark: "Moderate level" },
  { date: "26-02-2025", time: "15:45", reading: 1210, remark: "Continued decrease getting closer to normal" },
  { date: "27-02-2025", time: "09:45", reading: 1165, remark: "Almost back to normal range" },
  { date: "27-02-2025", time: "13:30", reading: 1140, remark: "Normal level achieved" },
  { date: "28-02-2025", time: "08:00", reading: 1135, remark: "Stable normal reading" },
  { date: "28-02-2025", time: "16:00", reading: 1145, remark: "Consistent throughout the day" }
];

// Process data for visualization
const processDataForChart = (data) => {
  return data.map((item, index) => ({
    name: `${item.date.substring(0, 5)} ${item.time}`,
    value: item.reading,
    normalizedValue: (item.reading - 1100) / 5, // Normalize for easier visualization
    index: index + 1,
    remark: item.remark,
    date: item.date,
    time: item.time,
  }));
};

// Calculate statistics
const calculateStats = (data) => {
  const readings = data.map(r => r.reading);
  const average = readings.reduce((sum, r) => sum + r, 0) / readings.length;
  const min = Math.min(...readings);
  const max = Math.max(...readings);
  
  // Calculate standard deviation
  const variance = readings.reduce((sum, r) => sum + Math.pow(r - average, 2), 0) / readings.length;
  const stdDev = Math.sqrt(variance);
  
  // Count readings by range
  const optimalCount = readings.filter(r => r >= 1130 && r <= 1190).length;
  const highCount = readings.filter(r => r > 1300).length;
  const moderateCount = readings.filter(r => r > 1190 && r <= 1300).length;
  
  return {
    average: Math.round(average),
    min,
    max,
    stdDev: Math.round(stdDev),
    optimalCount,
    highCount,
    moderateCount,
    totalReadings: readings.length,
    optimalPercentage: Math.round((optimalCount / readings.length) * 100),
    highPercentage: Math.round((highCount / readings.length) * 100),
    moderatePercentage: Math.round((moderateCount / readings.length) * 100),
  };
};

// Interpret the data
const interpretData = (stats, data) => {
  const spikeDays = data
    .filter(item => item.reading > 1300)
    .map(item => item.date)
    .filter((date, index, self) => self.indexOf(date) === index);
  
  // Calculate the trend by comparing first 3 days with last 3 days
  const firstThreeDaysAvg = data.slice(0, 6).reduce((sum, item) => sum + item.reading, 0) / 6;
  const lastThreeDaysAvg = data.slice(-6).reduce((sum, item) => sum + item.reading, 0) / 6;
  const trend = lastThreeDaysAvg - firstThreeDaysAvg;
  
  return {
    spikeDays,
    spikeCount: spikeDays.length,
    trend,
    trendDirection: trend < 0 ? "decreasing" : trend > 0 ? "increasing" : "stable",
    stability: stats.stdDev < 100 ? "high" : stats.stdDev < 150 ? "medium" : "low",
    overallAssessment: stats.optimalPercentage > 60 ? "good" : stats.optimalPercentage > 40 ? "fair" : "poor",
    riskLevel: stats.highPercentage > 30 ? "high" : stats.highPercentage > 15 ? "medium" : "low"
  };
};

// Generate recommendations based on interpretation
const generateRecommendations = (interpretation, stats) => {
  const recommendations = [];
  
  // Based on stability
  if (interpretation.stability === "low") {
    recommendations.push({
      title: "Improve Process Consistency",
      description: "Implement tighter controls on the sand mixing process to reduce the high variability in GCS readings.",
      priority: "High",
      icon: <Warning color="error" />,
    });
  }
  
  // Based on spike days
  if (interpretation.spikeCount > 0) {
    recommendations.push({
      title: "Investigate GCS Spikes",
      description: `Examine sand composition and moisture content relationships on ${interpretation.spikeDays.join(", ")} to identify root causes of significant spikes.`,
      priority: "High",
      icon: <PriorityHigh color="error" />,
    });
  }
  
  // Based on overall assessment
  if (interpretation.overallAssessment === "poor") {
    recommendations.push({
      title: "Revise Sand Mixture Formula",
      description: "Current formula results in inconsistent green strength. Consider adjusting bentonite percentage or exploring alternative binders.",
      priority: "High",
      icon: <Science color="error" />,
    });
  }
  
  // Based on trend
  if (interpretation.trendDirection === "increasing" && stats.average > 1200) {
    recommendations.push({
      title: "Reduce Clay Content",
      description: "The increasing trend in GCS readings suggests excessive clay content. Gradually reduce bentonite percentage by 0.5-1%.",
      priority: "Medium",
      icon: <TrendingDown color="warning" />,
    });
  } else if (interpretation.trendDirection === "decreasing" && stats.average < 1150) {
    recommendations.push({
      title: "Increase Binding Agents",
      description: "The decreasing trend in green strength indicates insufficient binding. Consider increasing bentonite or adding alternative binders.",
      priority: "Medium",
      icon: <TrendingUp color="warning" />,
    });
  }
  
  // Always include maintenance recommendation
  recommendations.push({
    title: "Equipment Calibration",
    description: "Ensure regular calibration of GCS testing equipment to minimize measurement errors and improve data reliability.",
    priority: "Medium",
    icon: <Assignment color="info" />,
  });
  
  // Always include preventive recommendations
  recommendations.push({
    title: "Implement Statistical Process Control",
    description: "Set up SPC charts with control limits at 1130-1190 gm/cm^2 for optimal green strength to quickly identify deviations.",
    priority: "Medium",
    icon: <BarChart color="info" />,
  });
  
  recommendations.push({
    title: "Operator Training",
    description: "Conduct refresher training on proper sand testing procedures to ensure consistent methodology and accurate results.",
    priority: "Low",
    icon: <Lightbulb color="success" />,
  });
  
  return recommendations;
};

// Root causes analysis
const generateRootCauses = (interpretation, stats) => {
  const rootCauses = [];
  
  if (stats.highPercentage > 20) {
    rootCauses.push({
      title: "Excessive Clay/Bentonite Content",
      impact: "High GCS readings above 1300 gm/cm^2",
      solution: "Reduce bentonite percentage by 0.5-1% and monitor results",
      probability: "High"
    });
    
    rootCauses.push({
      title: "Insufficient Mulling Time",
      impact: "Inconsistent GCS readings with high standard deviation",
      solution: "Increase mulling time by 1-2 minutes and ensure proper muller maintenance",
      probability: "Medium"
    });
  }
  
  if (interpretation.stability === "low") {
    rootCauses.push({
      title: "Inconsistent Moisture Content",
      impact: "Erratic GCS readings with poor repeatability",
      solution: "Implement automated moisture control systems and increase testing frequency",
      probability: "High"
    });
    
    rootCauses.push({
      title: "Varying Raw Material Quality",
      impact: "Unpredictable green sand properties",
      solution: "Establish stricter supplier quality requirements and incoming material testing",
      probability: "Medium"
    });
  }
  
  if (interpretation.trendDirection === "increasing") {
    rootCauses.push({
      title: "Accumulation of Fine Particles",
      impact: "Gradual increase in GCS readings over time",
      solution: "Increase new sand additions and optimize reclamation process to remove fines",
      probability: "High"
    });
  }
  
  // Always include potential equipment issues
  rootCauses.push({
    title: "Testing Equipment Calibration Issues",
    impact: "Inaccurate GCS measurements leading to incorrect process adjustments",
    solution: "Implement weekly calibration checks and maintain calibration records",
    probability: "Low"
  });
  
  return rootCauses;
};

// Quality impact analysis
const generateQualityImpacts = (interpretation) => {
  const impacts = [];
  
  if (interpretation.riskLevel === "high") {
    impacts.push({
      defect: "Hot Tears",
      probability: "High",
      mechanism: "Excessive green strength restricts casting contraction during solidification",
      prevention: "Maintain GCS between 1130-1190 gm/cm^2 and verify proper casting design"
    });
    
    impacts.push({
      defect: "Veining/Finning",
      probability: "High",
      mechanism: "High compressive strength combined with low permeability causes metal penetration along mold joints",
      prevention: "Reduce GCS to optimal range and ensure adequate venting in mold design"
    });
  }
  
  if (interpretation.stability === "low") {
    impacts.push({
      defect: "Dimensional Variations",
      probability: "Medium",
      mechanism: "Inconsistent sand properties lead to variable mold dimensions and casting geometry",
      prevention: "Stabilize sand system and implement statistical process control"
    });
  }
  
  impacts.push({
    defect: "Gas Porosity",
    probability: interpretation.riskLevel === "high" ? "High" : "Medium",
    mechanism: "Excessive green strength can reduce permeability and trap gases during pouring",
    prevention: "Balance GCS with adequate permeability (typically 130-170 AFS number)"
  });
  
  impacts.push({
    defect: "Surface Finish Issues",
    probability: "Medium",
    mechanism: "Sand with improper green strength can cause rough surfaces or metal penetration",
    prevention: "Maintain optimal GCS range and proper grain distribution"
  });
  
  return impacts;
};

const AIAnalysisPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showInsights, setShowInsights] = useState(false);
  
  // Process sample data
  const chartData = processDataForChart(sampleReadings);
  const stats = calculateStats(sampleReadings);
  const interpretation = interpretData(stats, sampleReadings);
  const recommendations = generateRecommendations(interpretation, stats);
  const rootCauses = generateRootCauses(interpretation, stats);
  const qualityImpacts = generateQualityImpacts(interpretation);

  // Distribution data for pie chart
  const distributionData = [
    { name: 'Optimal (1130-1190)', value: stats.optimalCount, color: '#4caf50' },
    { name: 'Moderate (1191-1300)', value: stats.moderateCount, color: '#ff9800' },
    { name: 'High (>1300)', value: stats.highCount, color: '#f44336' },
  ];

  useEffect(() => {
    // Simulate AI analysis loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Show insights with small delay for better UX
    const insightsTimer = setTimeout(() => {
      setShowInsights(true);
    }, 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(insightsTimer);
    };
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Health score calculation based on statistics
  const healthScore = Math.max(0, Math.min(100, 
    100 - (stats.highPercentage * 0.8) - 
    (20 - stats.optimalPercentage * 0.4) - 
    (Math.min(30, stats.stdDev / 10))
  ));

  return (
    <Container maxWidth="xl">
      <BackButton />
      
      <Box sx={{ flexGrow: 1, py: 4, mt: 4 }}>
        {/* Header with title and action buttons */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box>
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
             AI Analysis
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Advanced analytics and recommendations for Feb 20-28, 2025
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Print Report" arrow>
              <IconButton>
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share Analysis" arrow>
              <IconButton>
                <Share />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download Data" arrow>
              <IconButton>
                <Download />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Loading state */}
        {isLoading && (
          <Box sx={{ width: '100%', my: 8, textAlign: 'center' }}>
            <PsychologyIcon sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 3 }} />
            <Typography variant="h5" sx={{ mb: 3 }}>
              AI is analyzing Green Compressive Strength data...
            </Typography>
            <LinearProgress sx={{ maxWidth: 600, mx: 'auto', height: 8, borderRadius: 4 }} />
          </Box>
        )}

        {/* Analysis content */}
        {!isLoading && (
          <Fade in={!isLoading} timeout={1000}>
            <Box>
              {/* Executive summary card */}
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(38, 50, 56, 0.95) 0%, rgba(55, 71, 79, 0.95) 100%)',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Insights sx={{ mr: 1 }} />
                        <Typography variant="h5" fontWeight={700}>
                          Executive Summary
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                        Analysis indicates <strong>{interpretation.overallAssessment}</strong> green compressive strength control with 
                        <strong> {interpretation.stability}</strong> stability. The observed trend is 
                        <strong> {interpretation.trendDirection}</strong> with significant spikes detected on 
                        <strong> {interpretation.spikeDays.join(", ")}</strong>.
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                        Only <strong>{stats.optimalPercentage}%</strong> of readings fall within the optimal range (1130-1190 gm/cm^2),
                        while <strong>{stats.highPercentage}%</strong> show excessive strength above 1300 gm/cm^2,
                        presenting a <strong>{interpretation.riskLevel} risk</strong> of casting defects including hot tears and veining.
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <Chip 
                          icon={<Timeline />} 
                          label={`Avg: ${stats.average} gm/cm^2`} 
                          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} 
                        />
                        <Chip 
                          icon={<Analytics />} 
                          label={`Range: ${stats.min}-${stats.max} gm/cm^2`} 
                          sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} 
                        />
                        <Chip 
                          icon={interpretation.riskLevel === "high" ? <ErrorOutline /> : <CheckCircle />} 
                          label={`${interpretation.riskLevel.charAt(0).toUpperCase() + interpretation.riskLevel.slice(1)} Risk`} 
                          sx={{ 
                            bgcolor: interpretation.riskLevel === "high" 
                              ? 'rgba(244,67,54,0.7)' 
                              : interpretation.riskLevel === "medium" 
                                ? 'rgba(255,152,0,0.7)' 
                                : 'rgba(76,175,80,0.7)', 
                            color: 'white' 
                          }} 
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          borderRadius: 3, 
                          p: 2, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="h6" textAlign="center" mb={1}>
                          Sand System Health Score
                        </Typography>
                        
                        <Box 
                          sx={{
                            position: 'relative',
                            width: 150,
                            height: 150,
                            borderRadius: '50%',
                            background: `conic-gradient(
                              ${healthScore >= 75 ? '#4caf50' : healthScore >= 50 ? '#ff9800' : '#f44336'} ${healthScore}%,
                              rgba(255,255,255,0.2) ${healthScore}% 100%
                            )`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Box 
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              bgcolor: 'rgba(38, 50, 56, 0.8)',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography variant="h4" fontWeight={700}>
                              {Math.round(healthScore)}
                            </Typography>
                            <Typography variant="caption">out of 100</Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" textAlign="center">
                          {healthScore >= 75 
                            ? "Good condition with minor improvements needed" 
                            : healthScore >= 50 
                              ? "Requires attention to prevent defects" 
                              : "Critical issues need immediate action"}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
                
                {/* Background pattern */}
                <Box 
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    opacity: 0.05,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    zIndex: 1 
                  }}
                />
              </Paper>
              
              {/* Main analysis tabs and content */}
              <Paper sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    background: theme.palette.background.default 
                  }}
                >
                  <Tab label="Trend Analysis" icon={<Timeline />} iconPosition="start" />
                  <Tab label="Recommendations" icon={<Lightbulb />} iconPosition="start" />
                  <Tab label="Root Causes" icon={<BubbleChart />} iconPosition="start" />
                  <Tab label="Quality Impact" icon={<Assignment />} iconPosition="start" />
                </Tabs>
                
                {/* Tab 1: Trend Analysis */}
                {tabValue === 0 && (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} lg={8}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Green Compressive Strength Trend (Feb 20-28, 2025)
                        </Typography>
                        
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            bgcolor: 'background.default',
                            p: 2,
                            borderRadius: 2,
                            height: 400,
                            mb: 3
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                              <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0.1}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fontSize: 12 }} 
                                stroke={theme.palette.text.secondary}
                              />
                              <YAxis 
                                domain={[1100, 1500]} 
                                tick={{ fontSize: 12 }} 
                                stroke={theme.palette.text.secondary}
                              />
                              <RechartTooltip 
                                formatter={(value, name) => [`${value} gm/cm^2`, 'Green Strength']}
                                labelFormatter={(label) => `Reading: ${label}`}
                                contentStyle={{ 
                                  backgroundColor: theme.palette.background.paper,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 8,
                                  boxShadow: theme.shadows[3]
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke={theme.palette.primary.main} 
                                fillOpacity={1} 
                                fill="url(#colorValue)" 
                                strokeWidth={2}
                              />
                              
                              {/* Optimal range reference area */}
                              <RechartTooltip />
                              <svg>
                                <defs>
                                  <pattern id="optimalPattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                                    <rect width="2" height="2" fill="rgba(76, 175, 80, 0.3)" />
                                  </pattern>
                                </defs>
                              </svg>
                              <rect x="0" y="30" width="100%" height="60" fill="url(#optimalPattern)" fillOpacity="0.5" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Paper>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <Paper
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Typography variant="subtitle2" color="text.secondary">
                                Average GCS
                              </Typography>
                              <Typography variant="h4" sx={{ my: 0.5 }}>
                                {stats.average} <small>gm/cm^2</small>
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {stats.stdDev > 150 ? 'High variation - process unstable' : 'Acceptable variation'}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Paper
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'background.default',
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Typography variant="subtitle2" color="text.secondary">
                                Trend Direction
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', my: 0.5 }}>
                                {interpretation.trendDirection === "increasing" ? (
                                  <TrendingUp color="error" sx={{ mr: 1 }} />
                                ) : interpretation.trendDirection === "decreasing" ? (
                                  <TrendingDown color="success" sx={{ mr: 1 }} />
                                ) : (
                                  <Timeline color="info" sx={{ mr: 1 }} />
                                )}
                                <Typography variant="h6">
                                  {interpretation.trendDirection.charAt(0).toUpperCase() + interpretation.trendDirection.slice(1)}
                                </Typography>
                              </Box>
                              <Typography variant="body2" color="text.secondary">
                                {Math.abs(interpretation.trend).toFixed(1)} gm/cm^2 {interpretation.trend > 0 ? 'increase' : 'decrease'} over period
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} lg={4}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Reading Distribution
                        </Typography>
                        
                        <Paper 
                          elevation={0} 
                          sx={{ 
                            bgcolor: 'background.default',
                            p: 2,
                            borderRadius: 2,
                            height: 300,
                            mb: 3
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={distributionData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                labelLine={false}
                              >
                                {distributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartTooltip
                                formatter={(value, name) => [`${value} readings`, name]}
                                contentStyle={{ 
                                  backgroundColor: theme.palette.background.paper,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 8,
                                  boxShadow: theme.shadows[3]
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </Paper>
                        
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Key Insights
                        </Typography>
                        
                        <Fade in={showInsights}>
                          <List disablePadding>
                            <ListItem
                              sx={{
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <ListItemIcon>
                                <Chip 
                                  size="small" 
                                  label="CRITICAL" 
                                  sx={{ 
                                    bgcolor: theme.palette.error.main, 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    minWidth: 80
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary="High GCS Spike Detected" 
                                secondary={`Peak of ${stats.max} gm/cm^2 recorded on Feb 24th`} 
                              />
                            </ListItem>
                            
                            <ListItem
                              sx={{
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <ListItemIcon>
                                <Chip 
                                  size="small" 
                                  label="WARNING" 
                                  sx={{ 
                                    bgcolor: theme.palette.warning.main, 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    minWidth: 80
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Process Instability" 
                                secondary={`High standard deviation of ${stats.stdDev} gm/cm^2 indicates poor process control`} 
                              />
                            </ListItem>
                            
                            <ListItem
                              sx={{
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <ListItemIcon>
                                <Chip 
                                  size="small" 
                                  label="POSITIVE" 
                                  sx={{ 
                                    bgcolor: theme.palette.success.main, 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    minWidth: 80
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Recovery Trend" 
                                secondary="Readings returned to normal range by Feb 27-28" 
                              />
                            </ListItem>
                            
                            <ListItem
                              sx={{
                                bgcolor: 'background.default',
                                borderRadius: 2,
                                mb: 1,
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <ListItemIcon>
                                <Chip 
                                  size="small" 
                                  label="INFO" 
                                  sx={{ 
                                    bgcolor: theme.palette.info.main, 
                                    color: 'white',
                                    fontWeight: 'bold',
                                    minWidth: 80
                                  }} 
                                />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Optimal Range Performance" 
                                secondary={`Only ${stats.optimalPercentage}% of readings within optimal range (1130-1190 gm/cm^2)`} 
                              />
                            </ListItem>
                          </List>
                        </Fade>
                      </Grid>
                    </Grid>
                  </Box>
                )}
                
                {/* Tab 2: Recommendations */}
                {tabValue === 1 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      AI-Generated Recommendations
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {recommendations.map((rec, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Card 
                            variant="outlined" 
                            sx={{ 
                              borderRadius: 2,
                              height: '100%',
                              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: theme.shadows[4],
                              }
                            }}
                          >
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                                <Box sx={{ mr: 2 }}>
                                  {rec.icon}
                                </Box>
                                <Box>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="h6" sx={{ mr: 1 }}>
                                      {rec.title}
                                    </Typography>
                                    <Chip 
                                      size="small" 
                                      label={rec.priority} 
                                      sx={{ 
                                        bgcolor: 
                                          rec.priority === 'High' ? theme.palette.error.light :
                                          rec.priority === 'Medium' ? theme.palette.warning.light :
                                          theme.palette.success.light,
                                        color: 
                                          rec.priority === 'High' ? theme.palette.error.dark :
                                          rec.priority === 'Medium' ? theme.palette.warning.dark :
                                          theme.palette.success.dark,
                                        fontWeight: 'bold',
                                      }} 
                                    />
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    {rec.description}
                                  </Typography>
                                </Box>
                              </Box>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                sx={{ mt: 1 }}
                                endIcon={<ArrowForward />}
                              >
                                Implementation Details
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
                
                {/* Tab 3: Root Causes */}
                {tabValue === 2 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Root Cause Analysis
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {rootCauses.map((cause, index) => (
                        <Grid item xs={12} lg={6} key={index}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 2.5, 
                              borderRadius: 2,
                              height: '100%',
                              borderLeft: '4px solid',
                              borderLeftColor: 
                                cause.probability === 'High' ? theme.palette.error.main :
                                cause.probability === 'Medium' ? theme.palette.warning.main :
                                theme.palette.info.main,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                              <Typography variant="h6">
                                {cause.title}
                              </Typography>
                              <Chip 
                                size="small" 
                                label={`${cause.probability} Probability`} 
                                sx={{ 
                                  bgcolor: 
                                    cause.probability === 'High' ? theme.palette.error.light :
                                    cause.probability === 'Medium' ? theme.palette.warning.light :
                                    theme.palette.info.light,
                                  color: 
                                    cause.probability === 'High' ? theme.palette.error.dark :
                                    cause.probability === 'Medium' ? theme.palette.warning.dark :
                                    theme.palette.info.dark,
                                  fontWeight: 'bold',
                                }} 
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" color="text.secondary">
                                Impact:
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {cause.impact}
                              </Typography>
                            </Box>
                            
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">
                                Recommended Solution:
                              </Typography>
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {cause.solution}
                              </Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Causal Relationship Analysis
                      </Typography>
                      
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          The analysis shows clear correlations between Green Compressive Strength fluctuations and specific process parameters:
                        </Typography>
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                Primary Factors (Strong Correlation)
                              </Typography>
                              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Clay/Bentonite Content</strong> - Direct linear relationship with GCS readings
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Moisture Content</strong> - Inverse relationship, particularly significant below 3% moisture
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Mulling Time</strong> - Positive correlation until optimal point, then plateaus
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                          
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
                              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                                Secondary Factors (Moderate Correlation)
                              </Typography>
                              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Sand Grain Distribution</strong> - Finer grain profiles lead to higher GCS
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Temperature</strong> - Ambient temperature affects clay activation and moisture evaporation
                                </Typography>
                                <Typography component="li" variant="body2" sx={{ mb: 0.75 }}>
                                  <strong>Reclaimed Sand Percentage</strong> - Higher percentages introduce more fines and irregularities
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Box>
                  </Box>
                )}
                
                {/* Tab 4: Quality Impact */}
                {tabValue === 3 && (
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      Potential Casting Quality Impact
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                      <Alert 
                        severity={interpretation.riskLevel === "high" ? "error" : interpretation.riskLevel === "medium" ? "warning" : "info"}
                        sx={{ mb: 3, borderRadius: 2 }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          Quality Risk Assessment: {interpretation.riskLevel.toUpperCase()}
                        </Typography>
                        <Typography variant="body2">
                          Current GCS profile indicates {interpretation.riskLevel} risk of casting defects. 
                          {interpretation.riskLevel === "high" 
                            ? " Immediate process corrections recommended to avoid significant quality issues."
                            : interpretation.riskLevel === "medium"
                              ? " Process adjustments suggested to improve casting quality."
                              : " Continue monitoring to maintain quality standards."}
                        </Typography>
                      </Alert>
                      
                      <Grid container spacing={3}>
                        {qualityImpacts.map((impact, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Paper 
                              variant="outlined" 
                              sx={{ 
                                p: 2.5, 
                                borderRadius: 2,
                                height: '100%',
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ErrorOutline sx={{ mr: 1, color: 
                                    impact.probability === 'High' ? theme.palette.error.main :
                                    impact.probability === 'Medium' ? theme.palette.warning.main :
                                    theme.palette.info.main 
                                  }} />
                                  {impact.defect}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={`${impact.probability} Risk`} 
                                  sx={{ 
                                    bgcolor: 
                                      impact.probability === 'High' ? theme.palette.error.light :
                                      impact.probability === 'Medium' ? theme.palette.warning.light :
                                      theme.palette.info.light,
                                    color: 
                                      impact.probability === 'High' ? theme.palette.error.dark :
                                      impact.probability === 'Medium' ? theme.palette.warning.dark :
                                      theme.palette.info.dark,
                                    fontWeight: 'bold',
                                  }} 
                                />
                              </Box>
                              
                              <Divider sx={{ mb: 2 }} />
                              
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Defect Mechanism:
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {impact.mechanism}
                                </Typography>
                              </Box>
                              
                              <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Prevention Strategy:
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                  {impact.prevention}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                    
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Cost Impact Analysis
                      </Typography>
                      
                      <Paper 
                        variant="outlined" 
                        sx={{ 
                          p: 3, 
                          borderRadius: 2,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="body1" gutterBottom>
                          Based on current rejection rates and GCS profile, the estimated quality-related costs are:
                        </Typography>
                        
                        <Box sx={{ height: 300, mt: 3 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart
                              data={[
                                {
                                  name: 'Scrap & Rework',
                                  current: 42000,
                                  optimized: 15000,
                                },
                                {
                                  name: 'Testing & Inspection',
                                  current: 28000,
                                  optimized: 23000,
                                },
                                {
                                  name: 'Customer Returns',
                                  current: 35000,
                                  optimized: 8000,
                                },
                                {
                                  name: 'Process Downtime',
                                  current: 30000,
                                  optimized: 12000,
                                },
                              ]}
                              margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 5,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <RechartTooltip 
                                formatter={(value) => [`${value.toLocaleString()}`]}
                                contentStyle={{ 
                                  backgroundColor: theme.palette.background.paper,
                                  border: `1px solid ${theme.palette.divider}`,
                                  borderRadius: 8,
                                  boxShadow: theme.shadows[3]
                                }}
                              />
                              <Legend />
                              <Bar dataKey="current" name="Current Cost" fill={theme.palette.error.main} />
                              <Bar dataKey="optimized" name="With Optimized GCS" fill={theme.palette.success.main} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </Box>
                        
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Potential Annual Savings: $77,000
                          </Typography>
                          <Typography variant="body2">
                            Optimizing Green Compressive Strength control within the recommended range (1130-1190 gm/cm^2)
                            can reduce quality-related costs by approximately 57%, with the most significant improvements
                            in scrap reduction and reduced customer returns.
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                )}
              </Paper>
              
              {/* Additional action card at bottom */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%'
                    }}
                  >
                    <CompressIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                    <Box>
                      <Typography variant="h6">
                        Need More Detailed Analysis?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Our advanced analytics can integrate additional process parameters for a comprehensive view of your sand system.
                      </Typography>
                    </Box>
                    <Button variant="contained" sx={{ ml: 'auto' }}>
                      Advanced Analysis
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      height: '100%'
                    }}
                  >
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      Analysis Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Report generated on March 1, 2025 based on 18 GCS readings from Feb 20-28, 2025.
                    </Typography>
                    <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                      Export Report
                    </Button>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}
      </Box>
    </Container>
  );
};

export default AIAnalysisPage; 