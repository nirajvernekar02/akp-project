import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { LocalFireDepartment as LocalFireDepartmentIcon } from '@mui/icons-material';

const MetalPouringParameters = () => {
  const parameters = [
    {
      title: "Pouring Temperature",
      description: "Proper pouring temperature is crucial to avoid defects such as cold shuts or excessive shrinkage.",
      icon: LocalFireDepartmentIcon,
      color: "primary.main",
    },
    {
      title: "Pouring Rate",
      description: "Controls the flow of molten metal, which affects mold filling and surface finish.",
      icon: LocalFireDepartmentIcon,
      color: "secondary.main",
    },
    {
      title: "Pouring Time",
      description: "Ensures adequate filling of the mold without premature solidification.",
      icon: LocalFireDepartmentIcon,
      color: "error.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Metal Pouring Parameters
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

export default MetalPouringParameters;
