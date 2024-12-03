import React from 'react';
import { Container, Avatar, Typography, Grid, Link, Box, Stack } from '@mui/material';
import { GitHub, LinkedIn, Instagram, Email, Phone } from '@mui/icons-material';

const DeveloperPage = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: 4 }}>
      <Avatar
        alt="Niraj Vernekar"
        src="/NirajPhoto.jpeg"
        sx={{ width: 300, height: 300, margin: '0 auto', border: '3px solid #4CAF50' }}
      />
      <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold' }}>
       Niraj Vernekar
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Software Developer
      </Typography>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="body1" gutterBottom>
          If you encounter any issues or need assistance, feel free to reach out!
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginTop: 2 }}>
          <Link href="mailto:nirajvernekar02@gmail.com" color="inherit" underline="hover">
            <Email />nirajvernekar02@gmail.com
          </Link>
          <Link href="tel:+918217787117" color="inherit" underline="hover">
            <Phone /> 8217787117
          </Link>
        </Stack>
      </Box>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6" gutterBottom>
          Social Links
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Link href="https://github.com/nirajvernekar02" target="_blank" color="inherit" underline="hover">
              <GitHub sx={{ fontSize: 40 }} />
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://www.linkedin.com/in/niraj-vernekar-691875196/" target="_blank" color="inherit" underline="hover">
              <LinkedIn sx={{ fontSize: 40 }} />
            </Link>
          </Grid>
          <Grid item>
            <Link href="https://www.instagram.com/nirajvernekar02" target="_blank" color="inherit" underline="hover">
              <Instagram sx={{ fontSize: 40 }} />
            </Link>
          </Grid>
        </Grid>
      </Box>

      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ marginTop: 4, display: 'block' }}
      >
        &copy; 2024 Niraj Vernekar. All Rights Reserved.
      </Typography>
    </Container>
  );
};

export default DeveloperPage;
