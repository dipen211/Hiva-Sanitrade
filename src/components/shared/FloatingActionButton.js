import React from 'react';
import { Fab, Tooltip } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const FloatingActionButton = ({ onClick, icon = <AddIcon />, tooltip = "Add", className = "" }) => {
  return (
    <Tooltip title={tooltip} placement="left">
      <Fab
        color="primary"
        aria-label={tooltip}
        onClick={onClick}
        className={`fab ${className}`}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: 56,
          height: 56,
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6cdb 0%, #6b4190 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
          },
        }}
      >
        {icon}
      </Fab>
    </Tooltip>
  );
};

export default FloatingActionButton;
