// Update your main component to have the EXACT hero content
// Replace your home/products page content with this:

import React from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';

const ProductsPage = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section - EXACT match */}
      <div className="hero-section" style={{ 
        textAlign: 'center',
        marginBottom: '50px',
        padding: '60px 20px',
        background: 'transparent'
      }}>
        <Typography 
          variant="h1" 
          className="hero-title"
          sx={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '4rem',
            fontWeight: 900,
            background: 'linear-gradient(45deg, #ff0040, #ff6600, #ffff00, #00ff40, #00ffff, #8000ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textTransform: 'uppercase',
            letterSpacing: '8px',
            marginBottom: '20px',
            animation: 'neonPulse 2s ease-in-out infinite alternate'
          }}
        >
          MEME CAPS
        </Typography>
        
        <Typography 
          variant="body1" 
          className="hero-subtitle"
          sx={{
            fontFamily: 'VT323, monospace',
            fontSize: '1.8rem',
            color: '#ffff00',
            textTransform: 'uppercase',
            letterSpacing: '4px',
            textShadow: '0 0 10px #ff6600',
            margin: '0 auto',
            maxWidth: '800px'
          }}
        >
          EXISTENTIAL HEADWEAR FOR THE DIGITAL AGE
        </Typography>
      </div>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {/* You can map your actual products here, but for now here's the structure */}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <Card className="product-card" sx={{ position: 'relative' }}>
            <Chip 
              label="CLASSIC" 
              className="vaporwave-badge"
              sx={{
                position: 'absolute',
                top: 15,
                right: 15,
                background: 'linear-gradient(45deg, #00ff40, #00ffff)',
                color: '#0a0020',
                fontFamily: 'VT323, monospace',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                zIndex: 10
              }}
            />
            <CardMedia
              component="img"
              height="280"
              image="/fishandwomen/womenwantme-cap.jpg"
              alt="Women Want Me Cap"
              className="product-image"
            />
            <CardContent>
              <Typography 
                variant="h5" 
                className="product-name"
                sx={{
                  fontFamily: 'Orbitron, monospace',
                  fontWeight: 700,
                  color: '#00ffff',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  textShadow: '0 0 15px #00ff40',
                  fontSize: '1.3rem'
                }}
              >
                WOMEN WANT ME CAP
              </Typography>
              
              <Typography 
                variant="body2" 
                className="product-description"
                sx={{
                  fontFamily: 'VT323, monospace',
                  fontSize: '1.1rem',
                  color: '#ffff00',
                  lineHeight: 1.4,
                  mb: 2
                }}
              >
                The original. The legend. "WOMEN WANT ME FISH FEAR ME" in all caps glory.
              </Typography>
              
              <Typography 
                className="product-price"
                sx={{
                  fontFamily: 'Press Start 2P, monospace',
                  fontSize: '1.5rem',
                  background: 'linear-gradient(45deg, #ff6600, #ff0040)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'thermalPriceGlow 2s ease-in-out infinite alternate'
                }}
              >
                $24.99
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Repeat similar structure for other products... */}
      </Grid>
    </Container>
  );
};

export default ProductsPage;
