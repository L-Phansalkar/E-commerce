import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Fade,
  Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const MinimalEntrancePage = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay showing content for a smooth entrance effect
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        backgroundColor: '#fafafa',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Main Content Container */}
      <Fade in={showContent} timeout={1000}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}
        >
          {/* Hero Image */}
          <Box
            sx={{
              position: 'relative',
              mb: 4,
              maxWidth: { xs: '300px', sm: '400px', md: '500px' },
              width: '100%',
            }}
          >
            {!imageLoaded && (
              <Box
                sx={{
                  width: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  backgroundColor: 'grey.200',
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography color="text.secondary">Loading...</Typography>
              </Box>
            )}
            
            <img
              src="https://f4.bcbits.com/img/a2060325530_16.jpg" // Placeholder - you'll replace with your sloth image
              alt="Women Want Me Fish Fear Me - Psychedelic Otter"
              onLoad={() => setImageLoaded(true)}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                display: imageLoaded ? 'block' : 'none',
                transition: 'all 0.3s ease-in-out',
              }}
            />
          </Box>

          {/* Call to Action Button */}
          <Fade in={imageLoaded} timeout={800} style={{ transitionDelay: '500ms' }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                backgroundColor: '#1a1a1a',
                color: 'white',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                px: { xs: 3, sm: 4 },
                py: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                textTransform: 'none',
                letterSpacing: '0.02em',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  backgroundColor: '#333333',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Take Me to the Products
            </Button>
          </Fade>
        </Box>
      </Fade>

      {/* Subtle Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          zIndex: -1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '10%',
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          zIndex: -1,
        }}
      />
    </Box>
  );
};

export default MinimalEntrancePage;

// export default Home;