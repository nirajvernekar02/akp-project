import React, { useState } from 'react';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  BarChart as BarChartIcon,
  Layers as LayersIcon,
  Build as BuildIcon,
  Thermostat as ThermostatIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Avatar,
  Box,
  Grid,
  CssBaseline,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

const drawerWidth = 240;

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: <HomeIcon />, label: 'Dashboard', href: '/' },
    { icon: <InventoryIcon />, label: 'Inventory', href: '/inventory' },
    { icon: <BarChartIcon />, label: 'Analytics', href: '/analytics' },
    { icon: <LayersIcon />, label: 'Molds', href: '/molds' },
    { icon: <BuildIcon />, label: 'Equipment', href: '/equipment' },
    { icon: <ThermostatIcon />, label: 'Temperature', href: '/temperature' },
    { icon: <PeopleIcon />, label: 'Team', href: '/team' },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List>
        {menuItems.map((item, index) => (
          <ListItem button key={index} component="a" href={item.href}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

const Navbar = ({ toggleSidebar }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          {/* Placeholder for the Company Logo */}
          <Box
            component="img"
            src="/path/to/logo.png" // Replace with the actual path to the company logo
            alt="AKP Foundries Logo"
            sx={{ height: 40, width: 40, mr: 2 }}
          />
          <Typography variant="h6" noWrap>
            AKP Foundries
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
          <Avatar />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

const DashboardCard = ({ title, value, Icon, color }) => {
  return (
    <Card sx={{ minHeight: 150 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="subtitle1" color="textSecondary">
              {title}
            </Typography>
            <Typography variant="h5">{value}</Typography>
          </Box>
          <Icon sx={{ fontSize: 50, color }} />
        </Box>
      </CardContent>
    </Card>
  );
};

const FoundryDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${isSidebarOpen ? drawerWidth : 0}px)` },
          mt: 8,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Foundry Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Welcome back, John Doe
        </Typography>

        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Active Molds"
              value="24"
              Icon={LayersIcon}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Today's Production"
              value="1,284 units"
              Icon={BarChartIcon}
              color="secondary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Average Temperature"
              value="1450°C"
              Icon={ThermostatIcon}
              color="error.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardCard
              title="Team Members"
              value="18"
              Icon={PeopleIcon}
              color="success.main"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Production Overview
                </Typography>
                <Box
                  height={200}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ bgcolor: 'grey.100' }}
                >
                  Chart placeholder
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Activities
                </Typography>
                <Box>
                  {[1, 2, 3, 4].map((item) => (
                    <Box
                      key={item}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ bgcolor: 'grey.300', mr: 2 }}>
                          <BuildIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body1">
                            Mold Maintenance
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            2 hours ago
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" color="primary">
                        View
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FoundryDashboard;
