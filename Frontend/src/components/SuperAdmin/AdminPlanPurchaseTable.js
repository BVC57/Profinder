import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';

const AdminPlanPurchaseTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/superadmin/admin-subscriptions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.admins || []);
      } catch (err) {
        setError('Failed to load admin plan purchase details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ m: 2 }}>Admin Plan Purchase Details</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Profession</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Plan</TableCell>
            <TableCell>Usage</TableCell>
            <TableCell>Renewal Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((admin) => (
            <TableRow key={admin._id}>
              <TableCell>{admin.userId?.name || '-'}</TableCell>
              <TableCell>{admin.userId?.email || '-'}</TableCell>
              <TableCell>{admin.profession}</TableCell>
              <TableCell>{admin.city}</TableCell>
              <TableCell>{admin.subscription?.plan}</TableCell>
              <TableCell>{admin.subscription?.usage}</TableCell>
              <TableCell>{admin.subscription?.renewalDate ? new Date(admin.subscription.renewalDate).toLocaleDateString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AdminPlanPurchaseTable;
