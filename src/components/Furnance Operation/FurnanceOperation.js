import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Thermostat as ThermostatIcon } from '@mui/icons-material';

const FurnaceOperationParameters = () => {
  const parameters = [
    {
      title: "Melting Temperature",
      description: "Affects metal flow and quality, typically monitored for metals like iron, steel, aluminum, etc.",
      icon: ThermostatIcon,
      color: "primary.main",
    },
    {
      title: "Charge Composition",
      description: "Refers to the raw material mixture added to the furnace, which affects chemical composition and quality.",
      icon: ThermostatIcon,
      color: "secondary.main",
    },
    {
      title: "Slag Composition and Removal",
      description: "Helps avoid impurities that may affect the casting.",
      icon: ThermostatIcon,
      color: "error.main",
    },
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Furnace Operation Parameters
      </Typography>
      <Grid container spacing={3}>
        {parameters.map((param, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minHeight: 150, cursor: 'pointer', textAlign: 'center', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
              <CardContent>
                <param.icon sx={{ fontSize: 50, color: param.color }} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  {param.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {param.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FurnaceOperationParameters;
