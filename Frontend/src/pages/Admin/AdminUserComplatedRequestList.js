import { Box, Paper, Typography, Chip, CircularProgress, Alert, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';

const AdminUserComplatedRequestList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-completed-requests'],
    queryFn: async () => {
      const res = await axios.get('/api/user-requests/admin-requests');
      // Only return completed requests with user info
      return Array.isArray(res.data) ? res.data.filter(req => req.status === 'completed' && req.user) : [];
    },
  });

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={60} /></Box>;
  if (error) return <Alert severity="error">Error loading data</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main', letterSpacing: 1 }}>Completed User Requests</Typography>
      {data && data.length === 0 && <Typography>No completed requests.</Typography>}
      {data && data.length > 0 && (
        <Paper elevation={3} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3, background: 'white', boxShadow: 2 }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ background: 'linear-gradient(90deg, #e0f7fa 0%, #f1f8e9 100%)' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Completed On</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Estimated Days</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Admin Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((req) => (
                <TableRow key={req._id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#f5f5f5' } }}>
                  <TableCell>{req.user?.name}</TableCell>
                  <TableCell>{req.user?.email}</TableCell>
                  <TableCell>{req.title}</TableCell>
                  <TableCell>{req.description}</TableCell>
                  <TableCell><Chip label={req.status} color="success" size="small" /></TableCell>
                  <TableCell>{req.updatedAt ? new Date(req.updatedAt).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>{req.timeline?.estimatedDays || '-'}</TableCell>
                  <TableCell>{req.adminNotes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AdminUserComplatedRequestList;