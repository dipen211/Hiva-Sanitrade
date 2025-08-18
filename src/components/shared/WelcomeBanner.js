import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { 
  Business as BusinessIcon, 
  Inventory as InventoryIcon, 
  Receipt as ReceiptIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './WelcomeBanner.css';

const WelcomeBanner = ({ userName = "User" }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Add Company",
      description: "Register a new business partner",
      icon: <BusinessIcon />,
      action: () => navigate('/add-company'),
      color: '#667eea'
    },
    {
      title: "Browse Products",
      description: "Explore available items",
      icon: <InventoryIcon />,
      action: () => navigate('/products'),
      color: '#10b981'
    },
    {
      title: "Create Invoice",
      description: "Generate new invoice",
      icon: <ReceiptIcon />,
      action: () => navigate('/invoice'),
      color: '#f59e0b'
    }
  ];

  const features = [
    {
      icon: <SpeedIcon />,
      title: "Fast & Efficient",
      description: "Streamlined workflow for maximum productivity"
    },
    {
      icon: <StarIcon />,
      title: "Premium Quality",
      description: "Professional-grade invoicing solution"
    },
    {
      icon: <TrendingUpIcon />,
      title: "Growth Focused",
      description: "Scale your business with confidence"
    }
  ];

  return (
    <Box className="welcome-banner">
      {/* Hero Section */}
      <Box className="hero-section">
        <Box className="hero-content">
          <Typography variant="h2" className="hero-title">
            Welcome back, {userName}! 👋
          </Typography>
          <Typography variant="h5" className="hero-subtitle">
            Manage your business with style and efficiency
          </Typography>
          <Typography variant="body1" className="hero-description">
            Create beautiful invoices, manage companies, and track your products all in one place.
          </Typography>
        </Box>
        <Box className="hero-decoration">
          <div className="floating-card card-1">
            <BusinessIcon />
          </div>
          <div className="floating-card card-2">
            <InventoryIcon />
          </div>
          <div className="floating-card card-3">
            <ReceiptIcon />
          </div>
        </Box>
      </Box>

      {/* Quick Actions */}
      <Box className="quick-actions-section">
        <Typography variant="h4" className="section-title">
          Quick Actions
        </Typography>
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="action-card" onClick={action.action}>
                <CardContent>
                  <Box className="action-icon" sx={{ color: action.color }}>
                    {action.icon}
                  </Box>
                  <Typography variant="h6" className="action-title">
                    {action.title}
                  </Typography>
                  <Typography variant="body2" className="action-description">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Typography variant="h4" className="section-title">
          Why Choose Hiva?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box className="feature-item">
                <Box className="feature-icon">
                  {feature.icon}
                </Box>
                <Typography variant="h6" className="feature-title">
                  {feature.title}
                </Typography>
                <Typography variant="body2" className="feature-description">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box className="cta-section">
        <Typography variant="h4" className="cta-title">
          Ready to get started?
        </Typography>
        <Typography variant="body1" className="cta-description">
          Create your first company and start managing your business efficiently.
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          className="cta-button"
          onClick={() => navigate('/add-company')}
        >
          Get Started Now
        </Button>
      </Box>
    </Box>
  );
};

export default WelcomeBanner;
