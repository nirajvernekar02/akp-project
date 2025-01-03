import React from 'react';
import { Container, Avatar, Typography, Grid, Link, Box, Stack } from '@mui/material';
import { GitHub, LinkedIn, Instagram, Email, Phone } from '@mui/icons-material';
import { motion } from 'framer-motion'; // For animations
import BackButton from '../SandTesting/BackButton'
const TeamMemberInline = ({ name, photo, email, linkedIn }) => (

  <Box
    sx={{ textAlign: 'center', margin: 2 }}
    component={motion.div}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <Avatar
      alt={name}
      src={photo}
      sx={{ width: 120, height: 120, margin: '0 auto', border: '3px solid #4CAF50' }}
    />
    <Typography variant="body1" sx={{ marginTop: 1, fontWeight: 'bold' }}>
      {name}
    </Typography>
    <Stack direction="row" justifyContent="center" spacing={1} sx={{ marginTop: 1 }}>
      <Link href={`mailto:${email}`} color="inherit" underline="hover">
        <Email sx={{ fontSize: 20 }} />
      </Link>
      <Link href={linkedIn} target="_blank" color="inherit" underline="hover">
        <LinkedIn sx={{ fontSize: 20 }} />
      </Link>
    </Stack>
  </Box>
);

const DeveloperPage = () => {
  return (
  <>  <BackButton/>
    <Container
      maxWidth="md"
      sx={{
        textAlign: 'center',
        padding: 4,
        backgroundColor: '#f7f9fc',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
    
      {/* Title Section */}
      <Typography
        variant="h3"
        sx={{
          marginBottom: 4,
          fontWeight: 'bold',
          color: '#4CAF50',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
        }}
        component={motion.h3}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Meet the Team
      </Typography>

      {/* Guide Section */}
      <Box sx={{ marginBottom: 6 }}>
        <Typography variant="h5" gutterBottom>
          Guide
        </Typography>
        <Box
          sx={{ textAlign: 'center' }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
        >
          <Avatar
            alt="Dr. Ganesh Chate"
            src="/ganesh.png"
            sx={{ width: 150, height: 150, margin: '0 auto', border: '3px solid #4CAF50' }}
          />
          <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 'bold' }}>
            Dr. Ganesh Chate
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Associate Professor, KLS GIT Belgaum
          </Typography>
        </Box>
      </Box>

      {/* Developer Information */}
      <Box sx={{ marginBottom: 6 }}>
        <Avatar
          alt="Niraj Vernekar"
          src="/NirajPhoto.jpeg"
          sx={{ width: 150, height: 150, margin: '0 auto', border: '3px solid #4CAF50' }}
        />
        <Typography variant="h4" sx={{ marginTop: 2, fontWeight: 'bold' }}>
          Niraj Vernekar
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Software Developer
        </Typography>

        {/* Contact Section */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="body1" gutterBottom>
            If you encounter any issues or need assistance, feel free to reach out!
          </Typography>
          <Stack direction="row" justifyContent="center" spacing={2} sx={{ marginTop: 2 }}>
            <Link href="mailto:nirajvernekar02@gmail.com" color="inherit" underline="hover">
              <Email /> nirajvernekar02@gmail.com
            </Link>
            <Link href="tel:+918217787117" color="inherit" underline="hover">
              <Phone /> 8217787117
            </Link>
          </Stack>
        </Box>

        {/* Social Links */}
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
      </Box>

      {/* Team Section */}
      <Box sx={{ marginBottom: 6 }}>
        <Typography variant="h5" gutterBottom>
          Team Members
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <TeamMemberInline
              name="Paras Jadhav"
              photo="/paras.jpeg"
              email="parasjadhav421@gmail.com"
              linkedIn="https://www.linkedin.com/in/paras-jadhav-9343932b7/"
            />
          </Grid>
          <Grid item>
            <TeamMemberInline
              name="Laxmikant Reddy"
              photo="/Laxmikant.jpeg"
              email="laxmikantreddy10@gmail.com"
              linkedIn="https://www.linkedin.com/in/laxmikant-reddy-42110923a/"
            />
          </Grid>
          <Grid item>
            <TeamMemberInline
              name="Amogh Saraf"
              photo="/Amogh.jpeg"
              email="saraffamogh@gmail.com"
              linkedIn="https://www.linkedin.com/in/amogh-saraff-6b4232246/"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ marginTop: 4, display: 'block' }}
      >
        &copy; 2024 Niraj Vernekar. All Rights Reserved.
      </Typography>
    </Container>
    </>
  );
};

export default DeveloperPage;
