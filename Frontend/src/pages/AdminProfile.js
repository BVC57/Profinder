import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Paper, Box, Chip, Button, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';

const AdminProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // If no ID is provided, fetch current user's profile
        if (!id) {
          const response = await axios.get('/api/users/profile');
          setAdmin(response.data.user);
        } else {
          const response = await axios.get(`/api/users/${id}`);
          setAdmin(response.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        if (err.response?.status === 404) {
          setError('Profile not found');
        } else if (err.response?.status === 401) {
          setError('Please log in to view this profile');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          <Typography>Loading profile...</Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mr: 1 }}
          >
            Go Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        {admin ? (
          <>
            <Typography variant="h5" gutterBottom>{admin.name}</Typography>
            {admin.profession && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Profession:</strong> {admin.profession}
              </Typography>
            )}
            {admin.experience && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Experience:</strong> {admin.experience}
              </Typography>
            )}
            {admin.city && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>City:</strong> {admin.city}
              </Typography>
            )}
            {admin.pincode && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Pincode:</strong> {admin.pincode}
              </Typography>
            )}
            {admin.email && (
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {admin.email}
              </Typography>
            )}
            {admin.mobile && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Mobile:</strong> {admin.mobile}
              </Typography>
            )}
            <Box mt={2}>
              {admin.verified ? (
                <Chip label="✅ Verified" color="success" />
              ) : (
                <Chip label="⏳ Pending Verification" color="warning" />
              )}
            </Box>
          </>
        ) : (
          <Typography>No profile data available</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AdminProfile;
