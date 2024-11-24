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
  Container,
  IconButton,
  CircularProgress,
  Avatar,
  useTheme,
  Fade,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Menu as MenuIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';

const DashboardCard = ({ title, icon: Icon, progress, secondaryMetric, secondaryValue, color, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Fade in={true} timeout={800}>
      <Card 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          transform: isHovered ? 'translateY(-8px)' : 'none',
          boxShadow: isHovered ? 
            '0 12px 24px -10px rgba(0,0,0,0.15)' : 
            '0 6px 12px -6px rgba(0,0,0,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}CC, ${color})`,
            transition: 'transform 0.3s ease-in-out',
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            gap: 2 
          }}>
            <Avatar
              sx={{
                bgcolor: `${color}22`,
                color: color,
                width: 56,
                height: 56,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                transition: 'color 0.3s ease',
              }}
            >
              {title}
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500 
              }}
            >
              Progress
            </Typography>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <CircularProgress 
                variant="determinate" 
                value={progress} 
                size={64}
                thickness={6}
                sx={{ 
                  color: color,
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  transform: 'translate(-50%, -50%)',
                  fontWeight: 700,
                  color: 'text.primary'
                }}
              >
                {progress}%
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, opacity: 0.1 }} />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mt: 2
          }}>
            <Typography 
              variant="body2" 
              sx={{ color: 'text.secondary' }}
            >
              {secondaryMetric}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: color
              }}
            >
              {secondaryValue}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const user = {
    name: "Admin",
    designation: "Quality Manager"
  };

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 4 } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 800,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              AKP FOUNDRIES
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: 'text.secondary',
                borderLeft: '2px solid',
                borderColor: 'divider',
                pl: 2,
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Quality Management System
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 3,
            color: 'text.primary' 
          }}>
            <Tooltip title="Current Location" arrow>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                display: { xs: 'none', md: 'flex' }
              }}>
                <LocationIcon color="action" sx={{ fontSize: 20 }} />
                <Typography variant="body2">Belgaum</Typography>
              </Box>
            </Tooltip>

            <Tooltip title="Current Time" arrow>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                display: { xs: 'none', md: 'flex' }
              }}>
                <ScheduleIcon color="action" sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  {currentDateTime.toLocaleTimeString()}
                </Typography>
              </Box>
            </Tooltip>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              borderLeft: '1px solid',
              borderColor: 'divider',
              pl: 2
            }}>
              <Avatar sx={{ 
                width: 36, 
                height: 36,
                bgcolor: theme.palette.primary.main 
              }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.designation}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4, 
            fontWeight: 800,
            color: 'text.primary',
            textAlign: 'center'
          }}
        >
          Process Control Dashboard
        </Typography>

        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <DashboardCard
              title="Sand Testing"
              icon={ScienceIcon}
              progress={75}
              secondaryMetric="Current Shift"
              secondaryValue="Shift 1"
              color={theme.palette.primary.main}
              onClick={() => navigate('/sand-testing')}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard
              title="Statistical Process Control"
              icon={TimelineIcon}
              progress={85}
              secondaryMetric="Defect Rate"
              secondaryValue="2.5%"
              color={theme.palette.secondary.main}
              onClick={() => navigate('/spcdas')}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;