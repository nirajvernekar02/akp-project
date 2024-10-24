import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

const ProductionAndEfficiencyParameters = () => {
  const parameters = [
    {
      title: "Yield",
      description: "Monitors the ratio of the weight of the casting to the weight of the total charge.",
      icon: TimelineIcon,
      color: "primary.main",
    },
    {
      title: "Cycle Time",
      description: "Measures the time for completing one casting cycle, crucial for production efficiency.",
      icon: TimelineIcon,
      color: "secondary.main",
    },
    {
      title: "Energy Consumption",
      description: "Monitoring power used by furnaces, ovens, etc., to control operational costs.",
      icon: TimelineIcon,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Production and Efficiency Parameters
      </Typography>
      <Grid container spacing={3}>
        {parameters.map((param, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ minHeight: 150, textAlign: 'center', '&:hover': { boxShadow: 6, transform: 'scale(1.05)' } }}>
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
    </Box>
  );
};

export default ProductionAndEfficiencyParameters;
