import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Card, CardContent,
  TextField, InputAdornment, Button, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody,
  TablePagination, CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  CurrencyRupee as RupeeIcon,
  Groups as UsersIcon,
  ReceiptLong as ReceiptIcon
} from '@mui/icons-material';
import axios from '../../api/axios';
import D3Charts from './Charts/D3Charts';
import D3LineChart from './Charts/D3linechart';
import D3PieChart from './Charts/D3pichart';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [userQuery, setUserQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    axios.get('/api/superadmin/allpayments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      if (res.data.success) {
        setPayments(res.data.payments);
        setFiltered(res.data.payments);
      }
      setLoading(false);
    }).catch(err => {
      console.error('Error fetching payments:', err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);

    const result = payments.filter(p => {
      const d = new Date(p.createdAt);
      return (!dateRange.from || d >= from) &&
        (!dateRange.to || d <= to) &&
        (!userQuery || (p.userId?.name || '').toLowerCase().includes(userQuery.toLowerCase()));
    });

    setFiltered(result);
  }, [dateRange, userQuery, payments]);

  const totalRevenue = filtered.reduce((acc, p) => acc + p.amount, 0);
  const totalPayments = filtered.length;
  const uniqueUsers = [...new Set(filtered.map(p => p.userId?.name || 'N/A'))].length;

  const clearFilters = () => {
    setDateRange({ from: '', to: '' });
    setUserQuery('');
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      <Typography variant="h4" gutterBottom>💳 Payment Dashboard</Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borrerRadius: 2 , border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <RupeeIcon color="primary" sx={{ mr: 2, fontSize: 35 }} />
                <Box>
                  <Typography variant="h5">₹{totalRevenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borrerRadius: 2 , border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon color="secondary" sx={{ mr: 2, fontSize: 35 }} />
                <Box>
                  <Typography variant="h5">{totalPayments}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Payments</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borrerRadius: 2 , border: '1px solid #e0e0e0' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <UsersIcon color="success" sx={{ mr: 2, fontSize: 35 }} />
                <Box>
                  <Typography variant="h5">{uniqueUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">Unique Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search by Name"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="From Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="To Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={() => {}}>Search</Button>
              <Button variant="outlined" onClick={clearFilters}>Clear</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Table */}
      <Paper>
        {loading ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>User</strong></TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Method</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment ID</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => (
                    <TableRow key={p._id}>
                      <TableCell>{p.userId?.name || 'N/A'}</TableCell>
                      <TableCell>{p.userId?.email || 'N/A'}</TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell>{p.paymentMethod}</TableCell>
                      <TableCell>{p.paymentStatus}</TableCell>
                      <TableCell>{p.razorpayPaymentId}</TableCell>
                      <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No payments found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </>
        )}

        {/* Charts */}
      <Paper sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>📈 Charts Overview</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <D3PieChart data={filtered} />
          </Grid>
          <Grid item xs={12} md={6}>
            <D3LineChart data={filtered} />
          </Grid>
          <Grid item xs={12}>
            <D3Charts data={filtered} />
          </Grid>
        </Grid>
      </Paper>
      </Paper>
    </Box>
  );
};

export default AdminPayments;
