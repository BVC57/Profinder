import React from 'react';
import { Container, Typography, Alert, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import UserDataDashboard from '../components/SuperAdmin/UserDataDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

const UserDataDashboardPage = () => {
  const { user } = useAuth();

  // Check if user has permission to access this page
  const hasPermission = user?.role === 'superadmin' || user?.role === 'admin';

  if (!hasPermission) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">
          You don't have permission to access this page. Only super admins and admins can view user data.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <UserDataDashboard />
    </Box>
  );
};

export default UserDataDashboardPage; 