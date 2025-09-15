import React, { useState } from 'react';
import { Box, Paper, Typography, Button, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from '../../api/axios';

export const AdminUserPendingRequestList = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-pending-requests'],
    queryFn: async () => {
      const res = await axios.get('/api/user-requests/admin-requests');
      return Array.isArray(res.data) ? res.data.filter(req => req.status === 'pending') : [];
    },
  });

  const [actionDialog, setActionDialog] = useState({ open: false, type: '', request: null });
  const [actionForm, setActionForm] = useState({ startDate: '', endDate: '', adminNotes: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const openActionDialog = (type, request) => {
    setActionForm({ startDate: '', endDate: '', adminNotes: '' });
    setActionError('');
    setActionDialog({ open: true, type, request });
  };
  const closeActionDialog = () => setActionDialog({ open: false, type: '', request: null });

  const handleActionSubmit = async () => {
    setActionLoading(true);
    setActionError('');
    try {
      if (actionDialog.type === 'approve') {
        if (!actionForm.startDate || !actionForm.endDate) {
          setActionError('Start and end dates are required.');
          setActionLoading(false);
          return;
        }
        await axios.put(`/api/user-requests/admin-response/${actionDialog.request._id}`, {
          status: 'approved',
          adminNotes: actionForm.adminNotes,
          startDate: actionForm.startDate,
          endDate: actionForm.endDate
        });
      } else if (actionDialog.type === 'reject') {
        await axios.put(`/api/user-requests/admin-response/${actionDialog.request._id}`, {
          status: 'rejected',
          adminNotes: actionForm.adminNotes
        });
      }
      await refetch();
      closeActionDialog();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Action failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress size={60} /></Box>;
  if (error) return <Alert severity="error">Error loading data</Alert>;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Pending User Requests</Typography>
      <Stack spacing={3}>
        {data && data.length === 0 && <Typography>No pending requests.</Typography>}
        {data && data.map((req) => (
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }} key={req._id}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{req.title}</Typography>
                <Typography variant="body2" color="text.secondary">{req.user?.name} ({req.user?.email})</Typography>
              </Box>
              <Chip label={req.status} color="warning" sx={{ ml: 'auto', fontWeight: 'bold' }} />
            </Stack>
            <Typography variant="body1" sx={{ mb: 1 }}>{req.description}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Estimated Days: {req.timeline?.estimatedDays}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Requested on {new Date(req.createdAt).toLocaleDateString()}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" color="success" onClick={() => openActionDialog('approve', req)}>
                Approve
              </Button>
              <Button variant="outlined" color="error" onClick={() => openActionDialog('reject', req)}>
                Reject
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* Action Dialog */}
      <Dialog open={actionDialog.open} onClose={closeActionDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionDialog.type === 'approve' && 'Approve Request'}
          {actionDialog.type === 'reject' && 'Reject Request'}
        </DialogTitle>
        <DialogContent>
          {actionError && <Alert severity="error" sx={{ mb: 2 }}>{actionError}</Alert>}
          {actionDialog.type === 'approve' && (
            <>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={actionForm.startDate}
                onChange={e => setActionForm(f => ({ ...f, startDate: e.target.value }))}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={actionForm.endDate}
                onChange={e => setActionForm(f => ({ ...f, endDate: e.target.value }))}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Notes (optional)"
                fullWidth
                multiline
                minRows={2}
                value={actionForm.adminNotes}
                onChange={e => setActionForm(f => ({ ...f, adminNotes: e.target.value }))}
              />
            </>
          )}
          {actionDialog.type === 'reject' && (
            <TextField
              label="Rejection Notes (optional)"
              fullWidth
              multiline
              minRows={2}
              value={actionForm.adminNotes}
              onChange={e => setActionForm(f => ({ ...f, adminNotes: e.target.value }))}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeActionDialog} disabled={actionLoading}>Cancel</Button>
          <Button onClick={handleActionSubmit} variant="contained" disabled={actionLoading}>
            {actionLoading ? 'Processing...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
