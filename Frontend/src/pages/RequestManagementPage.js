import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import RequestManagement from '../components/RequestManagement';

const RequestManagementPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <RequestManagement />
      </Box>
    </Container>
  );
};

export default RequestManagementPage; 