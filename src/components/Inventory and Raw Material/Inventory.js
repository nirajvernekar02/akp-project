import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Inventory as InventoryIcon } from '@mui/icons-material';

const InventoryAndRawMaterialParameters = () => {
  const parameters = [
    {
      title: "Raw Material Inventory",
      description: "Tracking raw materials like scrap, sand, additives.",
      icon: InventoryIcon,
      color: "primary.main",
    },
    {
      title: "Additive Composition",
      description: "Tracking and adjusting the levels of materials like binders, fluxes, or modifiers.",
      icon: InventoryIcon,
      color: "secondary.main",
    },
  ];

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Inventory and Raw Material Parameters
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

export default InventoryAndRawMaterialParameters;
