import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Home as HomeIcon, ArrowBack as ArrowBackIcon, Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box className="not-found-container">
      <Box className="not-found-content">
        {/* 404 Animation */}
        <Box className="error-animation">
          <Typography variant="h1" className="error-code">
            4
            <span className="rotating-zero">0</span>
            4
          </Typography>
          <Box className="search-icon-container">
            <SearchIcon className="search-icon" />
          </Box>
        </Box>

        {/* Error Message */}
        <Typography variant="h3" className="error-title">
          Oops! Page not found
        </Typography>
        
        <Typography variant="h6" className="error-subtitle">
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        
        <Typography variant="body1" className="error-description">
          Don't worry, let's get you back on track! You can go back to the previous page or visit our homepage to explore more.
        </Typography>

        {/* Action Buttons */}
        <Box className="error-actions">
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
            className="primary-action-btn"
          >
            Go to Homepage
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            className="secondary-action-btn"
          >
            Go Back
          </Button>
        </Box>

        {/* Helpful Links */}
        <Box className="helpful-links">
          <Typography variant="body2" className="links-title">
            Or try these popular pages:
          </Typography>
          <Box className="links-container">
            <Button 
              variant="text" 
              onClick={() => navigate('/')}
              className="link-btn"
            >
              Products
            </Button>
            <Button 
              variant="text" 
              onClick={() => navigate('/invoice')}
              className="link-btn"
            >
              Create Invoice
            </Button>
            <Button 
              variant="text" 
              onClick={() => navigate('/add-company')}
              className="link-btn"
            >
              Add Company
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Background Decoration */}
      <Box className="background-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>
      </Box>
    </Box>
  );
};

export default NotFound;
