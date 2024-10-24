import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';

const ChemicalCompositionParameters = () => {
  const parameters = [
    {
      title: "Carbon and Silicon Content",
      description: "Important for ferrous alloys (e.g., cast iron) to control hardness and ductility.",
      icon: ScienceIcon,
      color: "primary.main",
    },
    {
      title: "Alloy Additions",
      description: "Additions like manganese, chromium, etc., affect final mechanical properties.",
      icon: ScienceIcon,
      color: "secondary.main",
    },
    {
      title: "Grain Structure",
      description: "Monitored through metallographic analysis to ensure desired microstructure.",
      icon: ScienceIcon,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chemical Composition and Metallurgical Properties
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

export default ChemicalCompositionParameters;
