import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { FaTree, FaAirFreshener, FaThermometerHalf } from 'react-icons/fa'; // Import icons from react-icons

const EnvironmentalAndSafetyParameters = () => {
  const parameters = [
    {
      title: "Emission Levels",
      description: "Tracking emissions from the melting process to comply with environmental regulations.",
      icon: FaTree, // Use Font Awesome Tree icon
      color: "primary.main",
    },
    {
      title: "Ventilation and Air Quality",
      description: "Maintaining safe air quality for worker safety.",
      icon: FaAirFreshener, // Use Font Awesome Air Freshener icon
      color: "secondary.main",
    },
    {
      title: "Temperature of Workplace",
      description: "Ensuring a safe temperature environment for workers near furnaces.",
      icon: FaThermometerHalf, // Use Font Awesome Thermometer icon
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Environmental and Safety Parameters
      </Typography>
      <Grid container spacing={3}>
        {parameters.map((param, index) => {
          const IconComponent = param.icon; // Assign the icon component

          return (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  minHeight: 150,
                  textAlign: 'center',
                  '&:hover': { boxShadow: 6, transform: 'scale(1.05)' },
                  transition: 'transform 0.2s',
                }}
              >
                <CardContent>
                  <IconComponent style={{ fontSize: 50, color: param.color }} /> {/* Render the icon */}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {param.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {param.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default EnvironmentalAndSafetyParameters;
