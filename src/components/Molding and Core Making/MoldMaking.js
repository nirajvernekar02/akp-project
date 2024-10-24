import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Construction as ConstructionIcon } from '@mui/icons-material';

const MoldingAndCoreMakingParameters = () => {
  const parameters = [
    {
      title: "Mold Hardness",
      description: "Ensures the mold is robust enough to hold shape during casting.",
      icon: ConstructionIcon,
      color: "primary.main",
    },
    {
      title: "Mold Surface Finish",
      description: "Determines the quality of the surface to ensure a defect-free casting.",
      icon: ConstructionIcon,
      color: "secondary.main",
    },
    {
      title: "Core Strength",
      description: "Monitors the strength of the cores used to create internal features of castings.",
      icon: ConstructionIcon,
      color: "error.main",
    },
  ];

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Molding and Core Making Parameters
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

export default MoldingAndCoreMakingParameters;
