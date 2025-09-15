import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import NotificationList from '../components/NotificationList';

const NotificationsPage = () => (
  <Container maxWidth="md">
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>Notifications</Typography>
      <NotificationList />
    </Box>
  </Container>
);

export default NotificationsPage; 