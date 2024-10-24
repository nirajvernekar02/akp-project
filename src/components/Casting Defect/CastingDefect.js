import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Report as ReportIcon } from '@mui/icons-material';

const CastingDefectAnalysis = () => {
  const parameters = [
    {
      title: "Porosity Levels",
      description: "Checked through X-ray analysis or ultrasonic testing to ensure quality.",
      icon: ReportIcon,
      color: "primary.main",
    },
    {
      title: "Cracks and Hot Tears",
      description: "Ensuring molds are properly designed and cooled to avoid these common defects.",
      icon: ReportIcon,
      color: "secondary.main",
    },
    {
      title: "Shrinkage",
      description: "Controlled through effective riser design and solidification methods.",
      icon: ReportIcon,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Casting Defect Analysis
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

export default CastingDefectAnalysis;
