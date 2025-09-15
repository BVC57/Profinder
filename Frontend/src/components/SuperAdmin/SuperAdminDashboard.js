import AdminPlanPurchaseTable from './AdminPlanPurchaseTable';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
  Close as CloseIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import axios from '../../api/axios';
import Navbar from '../Navbar';
import TimeSeriesLineChart from '../TimeSeriesLineChart';
import StatCards from './StatCards';
import NewUsersTable from './NewUsersTable';
import SuperAdminSimpleBarChart from './SuperAdminSimpleBarChart';

// Chart components (we'll use a simple bar chart with CSS for now)
const StatCard = ({ title, value, icon, color, onClick, loading }) => (
  <Card 
    sx={{ 
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      background: `linear-gradient(135deg, ${color}15, ${color}25)`,
      border: `1px solid ${color}30`
    }}
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
            {loading ? '...' : value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {title}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            p: 2, 
            borderRadius: '50%', 
            backgroundColor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// Simple Bar Chart Component


// Detail Dialog Component
const DetailDialog = ({ open, onClose, title, data, type }) => {
  const getStatusChip = (status) => {
    const statusConfig = {
      verified: { color: 'success', label: 'Verified' },
      pending: { color: 'warning', label: 'Pending' },
      rejected: { color: 'error', label: 'Rejected' }
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {title}
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ overflow: 'unset' }}>
        <List>
          {data.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemAvatar>
                <Avatar>
                  {item.name ? item.name.charAt(0).toUpperCase() : 
                   item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  type === 'users' ? item.name :
                  item.userId?.name || 'Unknown User'
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {type === 'users' ? item.email :
                       `${item.profession || 'N/A'} • ${item.city || 'N/A'}`}
                    </Typography>
                    {type !== 'users' && item.status && (
                      <Box sx={{ mt: 1 }}>
                        {getStatusChip(item.status)}
                      </Box>
                    )}
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};


const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAdmins: 0,
    verifiedAdmins: 0,
    pendingAdmins: 0,
    newUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: '', data: [], type: '' });
  const [newUsersList, setNewUsersList] = useState([]);
  const [newUsersDialogOpen, setNewUsersDialogOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchNewUsersList();
  }, []);

  // Fetch new users joined in the last 7 days (or as per requirement)
  const fetchNewUsersList = async () => {
    try {
      const response = await axios.get('/api/superadmin/new-users');
      setNewUsersList(response.data);
      setStats((prev) => ({ ...prev, newUsers: response.data.length }));
    } catch (error) {
      console.error('Error fetching new users:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/superadmin/dashboard-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (type) => {
    try {
      let endpoint = '';
      let title = '';
      
      switch (type) {
        case 'users':
          endpoint = '/api/superadmin/users';
          title = 'All Users';
          break;
        case 'admins':
          endpoint = '/api/superadmin/admins';
          title = 'All Admins';
          break;
        case 'verified':
          endpoint = '/api/superadmin/verified-admins';
          title = 'Verified Admins';
          break;
        case 'pending':
          endpoint = '/api/superadmin/pending';
          title = 'Pending Admin Requests';
          break;
        default:
          return;
      }

      const response = await axios.get(endpoint);
      setDialogData({
        title,
        data: response.data,
        type
      });
      setDialogOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    }
  };

  const chartData = [stats.totalUsers, stats.totalAdmins, stats.verifiedAdmins, stats.pendingAdmins, stats.newUsers];
  const chartLabels = ['Users', 'Admins', 'Verified', 'Pending', 'New Joined'];
  const chartColors = ['#2196F3', '#FF9800', '#4CAF50', '#F44336', '#673AB7'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Statistics Cards */}
      <StatCards stats={stats} loading={loading} handleCardClick={handleCardClick} />

      {/* New Users Joined Card */}
      <Box sx={{ mt: 3, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <StatCard
              title="New Users Joined"
              value={loading ? '...' : stats.newUsers}
              icon={<PeopleIcon />}
              color="#673AB7"
              loading={loading}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Chart */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <SuperAdminSimpleBarChart 
          data={chartData}
          labels={chartLabels}
          colors={chartColors}
        />
      </Paper>

      {/* Line Charts for Users and Admins */}
      {/* <TimeSeriesLineChart title="Total New Users" type="users" color="#2196F3" total={stats.totalUsers} />
      <TimeSeriesLineChart title="Total Admins" type="admins" color="#FF9800" total={stats.totalAdmins} /> */}

      {/* Quick Actions */}
      {/* <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => handleCardClick('pending')}
              sx={{ borderColor: '#F44336', color: '#F44336' }}
            >
              Review Pending Requests
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<ViewIcon />}
              onClick={() => handleCardClick('verified')}
              sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
            >
              View Verified Admins
            </Button>
          </Grid>
        </Grid>
      </Box> */}

      {/* Detail Dialog */}
      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogData.title}
        data={dialogData.data}
        type={dialogData.type}
      />

      {/* New Users Joined Table (Compact, Not Full Size) */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
        <NewUsersTable users={newUsersList} />
      </Box>

      {/* Admin Plan Purchase Details Table */}
      <Box sx={{ mt: 4 }}>
        <AdminPlanPurchaseTable />
      </Box>
    </Box>
  );

};

export default SuperAdminDashboard;
