import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Fade,
  Typography,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const Home = () => {
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
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        pb: { xs: 4, sm: 6, md: 8 },
      }}
    >
      {/* Animated Background with Otter Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(
                45deg,
                rgba(255, 0, 150, 0.3) 0%,
                rgba(0, 255, 255, 0.3) 25%,
                rgba(255, 255, 0, 0.3) 50%,
                rgba(150, 0, 255, 0.3) 75%,
                rgba(255, 0, 150, 0.3) 100%
              )
            `,
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite',
            zIndex: 1,
          },
          '@keyframes gradientShift': {
            '0%': {
              backgroundPosition: '0% 50%',
            },
            '50%': {
              backgroundPosition: '100% 50%',
            },
            '100%': {
              backgroundPosition: '0% 50%',
            },
          },
        }}
      >
        {/* Otter Image as Background - Full Height */}
        <Box
          component="img"
          src="/fishandwomen/otter.png"
          alt="Psychedelic Otter - Women Want Me Fish Fear Me"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'auto',
            height: '100vh',
            maxWidth: '100vw',
            objectFit: 'contain',
            filter: 'hue-rotate(0deg) saturate(1.2) brightness(1.1)',
            animation: 'colorChange 10s ease-in-out infinite',
            zIndex: 0,
            '@keyframes colorChange': {
              '0%': {
                filter: 'hue-rotate(0deg) saturate(1.2) brightness(1.1)',
              },
              '20%': {
                filter: 'hue-rotate(72deg) saturate(1.4) brightness(1.15)',
              },
              '40%': {
                filter: 'hue-rotate(144deg) saturate(1.3) brightness(1.1)',
              },
              '60%': {
                filter: 'hue-rotate(216deg) saturate(1.5) brightness(1.2)',
              },
              '80%': {
                filter: 'hue-rotate(288deg) saturate(1.3) brightness(1.1)',
              },
              '100%': {
                filter: 'hue-rotate(360deg) saturate(1.2) brightness(1.1)',
              },
            },
          }}
        />
      </Box>

      {/* Optional: Add a subtle overlay for better button visibility */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
          zIndex: 1,
        }}
      />


      {/* Call to Action Button - Fixed at Bottom */}
      <Fade in={showContent} timeout={800} style={{ transitionDelay: '500ms' }}>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          size="large"
          endIcon={<ArrowForward />}
          sx={{
            position: 'relative',
            zIndex: 3,
            backgroundColor: 'rgba(26, 26, 26, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: 700,
            fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.4rem' },
            px: { xs: 4, sm: 5, md: 6 },
            py: { xs: 2, sm: 2.5 },
            borderRadius: 100,
            textTransform: 'none',
            letterSpacing: '0.03em',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            animation: 'float 3s ease-in-out infinite',
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-10px)',
              },
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              color: '#1a1a1a',
              transform: 'scale(1.08)',
              boxShadow: '0 15px 50px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              '& .MuiSvgIcon-root': {
                transform: 'translateX(5px)',
              },
            },
            '&:active': {
              transform: 'scale(1.05)',
            },
            '& .MuiSvgIcon-root': {
              transition: 'transform 0.3s ease',
            },
          }}
        >
          Take Me to the Products
        </Button>
      </Fade>

      {/* Floating Orbs for Extra Psychedelic Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,0,255,0.3) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '0s',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '15%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '2s',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '5%',
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,0,0.3) 0%, transparent 70%)',
          filter: 'blur(35px)',
          animation: 'float 7s ease-in-out infinite',
          animationDelay: '4s',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default Home;