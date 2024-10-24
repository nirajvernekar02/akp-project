import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { AcUnit as AcUnitIcon } from '@mui/icons-material';

const CoolingAndSolidificationParameters = () => {
  const parameters = [
    {
      title: "Cooling Rate",
      description: "Affects grain structure and can help reduce casting defects.",
      icon: AcUnitIcon,
      color: "primary.main",
    },
    {
      title: "Riser Design",
      description: "Ensures adequate feeding during shrinkage to reduce defects like voids.",
      icon: AcUnitIcon,
      color: "secondary.main",
    },
    {
      title: "Solidification Time",
      description: "Should be controlled to minimize internal stresses and porosity.",
      icon: AcUnitIcon,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Cooling and Solidification Parameters
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

export default CoolingAndSolidificationParameters;
