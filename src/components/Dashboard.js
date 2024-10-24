import React from 'react';
import {
  Science as ScienceIcon,
  BubbleChart as BubbleChartIcon,
  WaterDrop as WaterDropIcon,
  Insights as InsightsIcon,
  Bolt as BoltIcon,
  Construction as ConstructionIcon,
  Thermostat as ThermostatIcon,
  BarChart as BarChartIcon,
  Engineering as EngineeringIcon,
  Speed as SpeedIcon,
  Report as ReportIcon,
  Security as SecurityIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  Grid,
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon, Settings as SettingsIcon } from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
          <Box
            component="img"
            src="../../public/AKP-Foundries®-HD-PNG.webp" // Replace with the actual path to the company logo
            alt="Foundry Lab Logo"
            sx={{ height: 40, width: 40, mr: 2 }}
          />
          <Typography variant="h6" noWrap>
            Foundry Lab Dashboard
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

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <List>
        <ListItem button onClick={() => (window.location.href = '/sand-testing')}>
          <ListItemIcon>
            <ScienceIcon />
          </ListItemIcon>
          <ListItemText primary="Sand Testing" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/mold-testing')}>
          <ListItemIcon>
            <ConstructionIcon />
          </ListItemIcon>
          <ListItemText primary="Molding & Core" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/furnace-operation')}>
          <ListItemIcon>
            <ThermostatIcon />
          </ListItemIcon>
          <ListItemText primary="Furnace Operation" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/metal-pouring')}>
          <ListItemIcon>
            <BoltIcon />
          </ListItemIcon>
          <ListItemText primary="Metal Pouring" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/chemical-composition')}>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary="Chemical Composition" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/cooling-solidification')}>
          <ListItemIcon>
            <EngineeringIcon />
          </ListItemIcon>
          <ListItemText primary="Cooling & Solidification" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/casting-defect-analysis')}>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Casting Defects" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/production-efficiency')}>
          <ListItemIcon>
            <SpeedIcon />
          </ListItemIcon>
          <ListItemText primary="Production & Efficiency" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/environmental-safety')}>
          <ListItemIcon>
            <SecurityIcon />
          </ListItemIcon>
          <ListItemText primary="Environmental & Safety" />
        </ListItem>
        <ListItem button onClick={() => (window.location.href = '/inventory-raw-material')}>
          <ListItemIcon>
            <InventoryIcon />
          </ListItemIcon>
          <ListItemText primary="Inventory" />
        </ListItem>
      </List>
    </Drawer>
  );
};

const DashboardTile = ({ title, Icon, color, href }) => {
  return (
    <Card
      sx={{
        minHeight: 150,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
        },
      }}
      onClick={() => (window.location.href = href)}
    >
      <CardContent>
        <Icon sx={{ fontSize: 50, color }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FoundryDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: '100%',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Foundry Dashboard
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Welcome back, John Doe
        </Typography>

        <Typography variant="h5" gutterBottom>
          Foundry Analytics
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Total Production"
              Icon={SpeedIcon}
              color="primary.main"
              href="/total-production" // Updated route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Defect Rate"
              Icon={ReportIcon}
              color="secondary.main"
              href="/defect-rate" // Updated route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Safety Incidents"
              Icon={SecurityIcon}
              color="error.main"
              href="/safety-incidents" // Updated route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Material Efficiency"
              Icon={BubbleChartIcon}
              color="success.main"
              href="/material-efficiency" // Updated route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Resource Utilization"
              Icon={InsightsIcon}
              color="warning.main"
              href="/resource-utilization" // Updated route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Environmental Impact"
              Icon={WaterDropIcon}
              color="info.main"
              href="/environmental-impact" // Updated route
            />
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom mt={4}>
          Operations Overview
        </Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Sand Testing Parameters"
              Icon={ScienceIcon}
              color="primary.main"
              href="/sand-testing" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Molding and Core Making"
              Icon={ConstructionIcon}
              color="secondary.main"
              href="/mold-testing" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Furnace Operation"
              Icon={ThermostatIcon}
              color="error.main"
              href="/furnace-operation" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Metal Pouring Parameters"
              Icon={BoltIcon}
              color="success.main"
              href="/metal-pouring" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Chemical Composition Analysis"
              Icon={BarChartIcon}
              color="warning.main"
              href="/chemical-composition" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Cooling and Solidification"
              Icon={EngineeringIcon}
              color="info.main"
              href="/cooling-solidification" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Casting Defects Overview"
              Icon={ReportIcon}
              color="primary.main"
              href="/casting-defect-analysis" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Production Efficiency Metrics"
              Icon={SpeedIcon}
              color="secondary.main"
              href="/production-efficiency" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Environmental and Safety Compliance"
              Icon={SecurityIcon}
              color="error.main"
              href="/environmental-safety" // Existing route
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <DashboardTile
              title="Inventory Management"
              Icon={InventoryIcon}
              color="success.main"
              href="/inventory-raw-material" // Existing route
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default FoundryDashboard;
