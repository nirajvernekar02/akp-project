import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Verified as VerifiedIcon } from '@mui/icons-material';

const QualityControlParameters = () => {
  const parameters = [
    {
      title: "Dimensional Accuracy",
      description: "Ensuring the cast part meets all dimensional specifications.",
      icon: VerifiedIcon,
      color: "primary.main",
    },
    {
      title: "Hardness",
      description: "Often tested using Brinell or Rockwell hardness tests.",
      icon: VerifiedIcon,
      color: "secondary.main",
    },
    {
      title: "Surface Finish Quality",
      description: "Surface roughness measurements ensure cast parts meet required finish levels.",
      icon: VerifiedIcon,
      color: "error.main",
    },
    {
      title: "Non-Destructive Testing (NDT)",
      description: "Methods such as radiography or ultrasonic inspection to check for hidden defects.",
      icon: VerifiedIcon,
      color: "success.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quality Control Parameters
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

export default QualityControlParameters;
