import React from 'react';
import { Alert, Box } from '@mui/material';
import { CheckCircle as SuccessIcon } from '@mui/icons-material';

const SuccessMessage = ({ message, onClose }) => {
  return (
    <Box sx={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
      <Alert 
        severity="success" 
        icon={<SuccessIcon />}
        onClose={onClose}
        sx={{ 
          minWidth: 300,
          boxShadow: 3,
          borderRadius: 2
        }}
      >
        {message}
      </Alert>
    </Box>
  );
};

export default SuccessMessage; 