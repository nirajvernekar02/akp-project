import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';

// DashboardTile component to match the existing style
const DashboardTile = ({ title, description, Icon, color, href }) => {
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
      onClick={() => window.location.href = href}
    >
      <CardContent>
        <Icon sx={{ fontSize: 50, color }} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const SandTesting = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3, mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Sand Testing Parameters
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Green Compressive Strength (GCS)"
            description="Indicates the compactness and strength of green sand."
            Icon={ScienceIcon}
            color="primary.main"
            href="/runner"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Moisture Content"
            description="Optimal moisture levels ensure good mold strength and prevent casting defects."
            Icon={ScienceIcon}
            color="secondary.main"
            href="/moisture-content"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Active Clay and Dead Clay"
            description="The percentage of active clay affects binding, while dead clay needs monitoring for its impact on performance."
            Icon={ScienceIcon}
            color="error.main"
            href="/clay-content"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Shear Strength"
            description="Measures the sand's resistance to forces that can displace the mold."
            Icon={ScienceIcon}
            color="success.main"
            href="/shear-strength"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Permeability"
            description="Determines the ability of gases to escape from the mold during casting."
            Icon={ScienceIcon}
            color="warning.main"
            href="/permeability"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardTile
            title="Sand Temperature"
            description="Affects sand properties and moldability."
            Icon={ScienceIcon}
            color="info.main"
            href="/sand-temperature"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SandTesting;
