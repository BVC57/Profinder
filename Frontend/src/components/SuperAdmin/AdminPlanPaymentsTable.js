
import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, TextField, InputAdornment, Box, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from '../../api/axios';

const statusColor = (status) => {
  if (status === 'Success') return 'success';
  if (status === 'Failed' || status === 'Cancelled') return 'error';
  if (status === 'Pending') return 'warning';
  return 'default';
};

const AdminPlanPaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/superadmin/allpayments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPayments((res.data.payments || []).filter(p => p.paymentType === 'ProPlanUpgrade'));
      } catch (err) {
        setError('Failed to load admin plan payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.userId?.name || '').toLowerCase().includes(q) ||
      (p.userId?.email || '').toLowerCase().includes(q) ||
      (p.razorpayPaymentId || '').toLowerCase().includes(q) ||
      (p.paymentStatus || '').toLowerCase().includes(q)
    );
  });

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
        <Typography variant="h6">Admin Plan Purchases</Typography>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search by name, email, status, ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ width: 300 }}
        />
      </Box>
    <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 3, boxShadow: 3 }}>
    
      <Table>
        <TableHead>
          <TableRow sx={{ background: '#f5f5f5' }}>
            <TableCell><b>Name</b></TableCell>
            <TableCell><b>Email</b></TableCell>
            <TableCell><b>Amount</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Payment ID</b></TableCell>
            <TableCell><b>Date</b></TableCell>
            <TableCell><b>Method</b></TableCell>
            <TableCell><b>Description</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((p) => (
            <TableRow key={p._id} hover sx={{ '&:hover': { background: '#f0f7fa' } }}>
              <TableCell>{p.userId?.name || '-'}</TableCell>
              <TableCell>{p.userId?.email || '-'}</TableCell>
              <TableCell>₹{p.amount}</TableCell>
              <TableCell>
                <Chip label={p.paymentStatus} color={statusColor(p.paymentStatus)} size="small" />
              </TableCell>
              <TableCell>{p.razorpayPaymentId}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
              <TableCell>{p.paymentMethod}</TableCell>
              <TableCell>{p.description}</TableCell>
            </TableRow>
          ))}
          {filtered.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">No plan purchases found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    </Box>
 
  );
};

export default AdminPlanPaymentsTable;
