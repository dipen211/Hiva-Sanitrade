import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import './LoadingScreen.css';

const LoadingScreen = ({ message = "Loading...", subtitle = null }) => {
  return (
    <Box className="loading-screen">
      <Box className="loading-content">
        <Box className="logo-container">
          <img src="/images/hiva.png" alt="Hiva Logo" className="loading-logo" />
          <Typography variant="h4" className="loading-brand">
            HIVA
          </Typography>
        </Box>

        <Box className="loading-animation">
          <CircularProgress 
            size={60} 
            thickness={4}
            className="loading-spinner"
          />
          <Box className="pulse-rings">
            <div className="pulse-ring ring-1"></div>
            <div className="pulse-ring ring-2"></div>
            <div className="pulse-ring ring-3"></div>
          </Box>
        </Box>

        <Typography variant="h6" className="loading-message">
          {message}
        </Typography>

        {subtitle && (
          <Typography variant="body1" className="loading-subtitle">
            {subtitle}
          </Typography>
        )}

        <Box className="loading-dots">
          <span className="dot dot-1"></span>
          <span className="dot dot-2"></span>
          <span className="dot dot-3"></span>
        </Box>
      </Box>

      <Box className="background-animation">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </Box>
    </Box>
  );
};

export default LoadingScreen;