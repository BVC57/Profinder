import AdminPlanPurchaseTable from './AdminPlanPurchaseTable';
import React, { useState, useEffect, useCallback } from 'react';
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
  Tooltip,
  Divider,
  useTheme,
  alpha,
  LinearProgress,
  Badge,
  Fab,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon,
  Close as CloseIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Payment as PaymentIcon,
  RequestPage as RequestIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  MonetizationOn as MoneyIcon,
  PersonAdd as PersonAddIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Notifications as NotificationsIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Security as SecurityIcon,
  Report as ReportIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CheckCircleOutline as SuccessIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Feedback as FeedbackIcon,
  Star as StarIcon,
  Block as BlockIcon,
  PersonOff as PersonOffIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalAtm as LocalAtmIcon
} from '@mui/icons-material';
import axios from '../../api/axios';
import TimeSeriesLineChart from '../TimeSeriesLineChart';
import StatCards from './StatCards';
import NewUsersTable from './NewUsersTable';
import SuperAdminSimpleBarChart from './SuperAdminSimpleBarChart';

// Enhanced Stat Card without top line, full width
const StatCard = ({ title, value, icon, color, onClick, loading, trend, subtitle, trendDirection = 'up' }) => {
  const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        height: '100%',
        '&:hover': onClick ? {
          transform: 'translateY(-4px) scale(1.02)',
          boxShadow: `0 12px 32px ${alpha(color, 0.3)}`,
        } : {},
        background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.15)} 100%)`,
        border: `1px solid ${alpha(color, 0.2)}`,
        borderRadius: 3,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ position: 'relative', p: 3, height: '100%' }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" height="100%">
          <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
              <Typography 
                variant="h3" 
                component="div" 
                sx={{ 
                  fontWeight: 800, 
                  color: color,
                  mb: 1,
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                {loading ? (
                  <Box sx={{ width: '60px', height: '40px' }}>
                    <CircularProgress size={24} sx={{ color }} />
                  </Box>
                ) : value}
              </Typography>
              <Typography 
                variant="h6" 
                color="text.primary" 
                sx={{ 
                  fontWeight: 600,
                  mb: subtitle ? 0.5 : 0
                }}
              >
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {trend && (
              <Box display="flex" alignItems="center" mt={2}>
                {trendDirection === 'up' ? (
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography 
                  variant="caption" 
                  color={trendDirection === 'up' ? 'success.main' : 'error.main'} 
                  fontWeight="bold"
                >
                  {trendDirection === 'up' ? '+' : '-'}{trend}% from last week
                </Typography>
              </Box>
            )}
          </Box>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: '16px', 
              backgroundColor: alpha(color, 0.15),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 8px 24px ${alpha(color, 0.25)}`,
            }}
          >
            {React.cloneElement(icon, { sx: { fontSize: 28, color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Full Width Revenue Chart
const RevenueChart = ({ data, loading }) => (
  <Paper sx={{ 
    p: 4, 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: 3,
    height: '400px'
  }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box>
        <Typography variant="h5" gutterBottom fontWeight="bold">
          Revenue Analytics
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          ${loading ? '...' : data?.totalRevenue?.toLocaleString() || '0'}
        </Typography>
      </Box>
      <Box display="flex" gap={2}>
        <Box textAlign="center">
          <Typography variant="caption">Monthly Growth</Typography>
          <Typography variant="h6" fontWeight="bold">+24.5%</Typography>
        </Box>
        <Box textAlign="center">
          <Typography variant="caption">Daily Average</Typography>
          <Typography variant="h6" fontWeight="bold">${((data?.totalRevenue || 0) / 30).toFixed(0)}</Typography>
        </Box>
      </Box>
    </Box>
    <Box sx={{ height: 250, display: 'flex', alignItems: 'end', gap: 2 }}>
      {(data?.monthlyRevenue || [15000, 18000, 22000, 25000, 30000, 35000]).map((value, index) => (
        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ mb: 1, opacity: 0.8 }}>
            ${(value / 1000).toFixed(0)}k
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: `${(value / Math.max(...(data?.monthlyRevenue || [15000, 18000, 22000, 25000, 30000, 35000]))) * 200}px`,
              backgroundColor: 'rgba(255,255,255,0.3)',
              borderRadius: '8px 8px 0 0',
              minHeight: 40,
              animation: `slideUp 0.8s ease-out ${index * 0.1}s both`,
              position: 'relative',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.4)',
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
          </Typography>
        </Box>
      ))}
    </Box>
  </Paper>
);

// Enhanced Activity Feed - Full Height
const ActivityFeed = ({ activities }) => (
  <Paper sx={{ p: 3, height: '400px', overflow: 'auto', borderRadius: 3 }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <NotificationsIcon sx={{ mr: 1 }} />
        Live Activity Feed
      </Typography>
      <Chip label="Live" color="success" size="small" />
    </Box>
    <List sx={{ p: 0 }}>
      {activities.map((activity, index) => (
        <React.Fragment key={index}>
          <ListItem sx={{ px: 0, py: 1.5 }}>
            <ListItemAvatar>
              <Avatar sx={{ 
                bgcolor: activity.type === 'user' ? 'primary.main' : 
                         activity.type === 'payment' ? 'success.main' : 
                         activity.type === 'error' ? 'error.main' : 'warning.main',
                width: 36,
                height: 36
              }}>
                {activity.type === 'user' ? <PersonAddIcon /> : 
                 activity.type === 'payment' ? <PaymentIcon /> : 
                 activity.type === 'error' ? <ErrorIcon /> : <RequestIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body2" fontWeight="medium">
                  {activity.message}
                </Typography>
              }
              secondary={
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                  <Chip 
                    label={activity.priority || 'Normal'} 
                    size="small" 
                    variant="outlined"
                    color={activity.priority === 'High' ? 'error' : activity.priority === 'Medium' ? 'warning' : 'default'}
                  />
                </Box>
              }
            />
          </ListItem>
          {index < activities.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  </Paper>
);

// Enhanced Request Status Chart - Full Width
const RequestStatusChart = ({ data }) => {
  const chartData = [
    { label: 'Pending Requests', value: data.pending, color: '#ff9800', icon: <ScheduleIcon /> },
    { label: 'Completed Requests', value: data.completed, color: '#4caf50', icon: <CheckCircleIcon /> },
    { label: 'Rejected Requests', value: data.rejected, color: '#f44336', icon: <CloseIcon /> },
    { label: 'In Progress', value: data.inProgress || 25, color: '#2196f3', icon: <RefreshIcon /> }
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Paper sx={{ p: 3, borderRadius: 3, height: '400px' }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Request Management Overview
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
        {chartData.map((item, index) => (
          <Box key={index}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
              <Box display="flex" alignItems="center">
                <Box sx={{ mr: 1, color: item.color }}>{item.icon}</Box>
                <Typography variant="body1" fontWeight="bold">
                  {item.label}
                </Typography>
              </Box>
              <Box textAlign="right">
                <Typography variant="h6" fontWeight="bold">
                  {item.value}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={total > 0 ? (item.value / total) * 100 : 0}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: alpha(item.color, 0.15),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: item.color,
                  borderRadius: 5
                }
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// System Health Monitor
const SystemHealthMonitor = () => {
  const healthMetrics = [
    { name: 'Server Uptime', value: '99.9%', status: 'excellent', color: '#4caf50' },
    { name: 'Database Response', value: '120ms', status: 'good', color: '#2196f3' },
    { name: 'API Success Rate', value: '98.5%', status: 'excellent', color: '#4caf50' },
    { name: 'Memory Usage', value: '67%', status: 'warning', color: '#ff9800' },
    { name: 'Error Rate', value: '0.2%', status: 'excellent', color: '#4caf50' }
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 3 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        System Health Monitor
      </Typography>
      <Grid container spacing={2} mt={1}>
        {healthMetrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box 
              sx={{ 
                p: 2, 
                border: `2px solid ${alpha(metric.color, 0.3)}`,
                borderRadius: 2,
                backgroundColor: alpha(metric.color, 0.05)
              }}
            >
              <Typography variant="body2" color="text.secondary" mb={1}>
                {metric.name}
              </Typography>
              <Typography variant="h6" fontWeight="bold" color={metric.color}>
                {metric.value}
              </Typography>
              <Chip 
                label={metric.status} 
                size="small" 
                sx={{ 
                  mt: 1, 
                  backgroundColor: alpha(metric.color, 0.1),
                  color: metric.color,
                  textTransform: 'capitalize'
                }} 
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

// User Management Table - Full Width
const UserManagementTable = ({ users, onUserAction }) => (
  <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
    <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
      <Typography variant="h6" fontWeight="bold">
        <PeopleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        User Management Center
      </Typography>
    </Box>
    <TableContainer sx={{ maxHeight: 500 }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><strong>User</strong></TableCell>
            <TableCell><strong>Email</strong></TableCell>
            <TableCell><strong>Status</strong></TableCell>
            <TableCell><strong>Role</strong></TableCell>
            <TableCell><strong>Last Login</strong></TableCell>
            <TableCell><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(users || []).map((user, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {user.name || 'Unknown User'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ID: {user.id || `USR${index + 1000}`}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>{user.email || `user${index}@example.com`}</TableCell>
              <TableCell>
                <Chip 
                  label={user.status || 'Active'} 
                  color={user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'error' : 'default'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip 
                  label={user.role || 'User'} 
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography variant="caption">
                  {user.lastLogin || '2 hours ago'}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <IconButton size="small" color="primary">
                    <ViewIcon />
                  </IconButton>
                  <IconButton size="small" color="warning">
                    <PersonOffIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <BlockIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

// Enhanced Detail Dialog
const DetailDialog = ({ open, onClose, title, data, type }) => {
  const getStatusChip = (status) => {
    const statusConfig = {
      verified: { color: 'success', label: 'Verified' },
      pending: { color: 'warning', label: 'Pending' },
      rejected: { color: 'error', label: 'Rejected' },
      active: { color: 'success', label: 'Active' },
      inactive: { color: 'default', label: 'Inactive' }
    };
    const config = statusConfig[status?.toLowerCase()] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">{title}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {item.name ? item.name.charAt(0).toUpperCase() : 
                         item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {type === 'users' ? item.name : item.userId?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type === 'users' ? item.email : item.userId?.email || 'No email'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {type === 'users' ? 
                        `${item.profession || 'N/A'} • ${item.city || 'N/A'}` :
                        `${item.profession || 'N/A'} • ${item.city || 'N/A'}`
                      }
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {item.status && getStatusChip(item.status)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton size="small" color="primary">
                        <ViewIcon />
                      </IconButton>
                      <IconButton size="small" color="success">
                        <CheckCircleIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
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
    newUsers: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    pendingRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    monthlyRevenue: [],
    suspendedUsers: 0,
    totalTransactions: 0,
    averageSessionDuration: 0,
    systemAlerts: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState({ title: '', data: [], type: '' });
  const [newUsersList, setNewUsersList] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  
  // Enhanced state variables
  const [revenueData, setRevenueData] = useState({ totalRevenue: 0, monthlyRevenue: [] });
  const [requestData, setRequestData] = useState({ pending: 0, completed: 0, rejected: 0, inProgress: 0 });
  const [activities, setActivities] = useState([
    { message: 'New premium user John Doe registered', time: '2 minutes ago', type: 'user', priority: 'High' },
    { message: 'Payment of $299 received from Admin Sarah Johnson', time: '5 minutes ago', type: 'payment', priority: 'Medium' },
    { message: 'Admin request approved for Mike Chen', time: '12 minutes ago', type: 'request', priority: 'Normal' },
    { message: 'System backup completed successfully', time: '15 minutes ago', type: 'system', priority: 'Normal' },
    { message: 'Security alert: Multiple failed login attempts', time: '18 minutes ago', type: 'error', priority: 'High' },
    { message: 'New enterprise subscription purchased', time: '25 minutes ago', type: 'payment', priority: 'High' },
    { message: 'User feedback submitted for review', time: '30 minutes ago', type: 'request', priority: 'Low' },
    { message: 'Database optimization completed', time: '35 minutes ago', type: 'system', priority: 'Normal' },
    { message: 'Bulk user import processed', time: '42 minutes ago', type: 'user', priority: 'Medium' },
    { message: 'API rate limit threshold reached', time: '45 minutes ago', type: 'error', priority: 'Medium' }
  ]);

  const theme = useTheme();

  // Auto-refresh functionality
  const fetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchNewUsersList(),
        fetchRevenueData(),
        fetchRequestData(),
        fetchAllUsers()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSnackbarMessage('Failed to fetch latest data');
      setSnackbarOpen(true);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchAllData, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchAllData, autoRefresh]);

  // Fetch functions
  const fetchNewUsersList = async () => {
    try {
      const response = await axios.get('/api/superadmin/new-users');
      setNewUsersList(response.data);
      setStats((prev) => ({ ...prev, newUsers: response.data.length }));
    } catch (error) {
      console.error('Error fetching new users:', error);
      // Mock data for demo
      const mockUsers = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['Active', 'Pending', 'Suspended'][Math.floor(Math.random() * 3)],
        role: ['User', 'Admin', 'Premium'][Math.floor(Math.random() * 3)],
        lastLogin: ['2 hours ago', '1 day ago', '3 days ago'][Math.floor(Math.random() * 3)]
      }));
      setNewUsersList(mockUsers);
      setStats((prev) => ({ ...prev, newUsers: mockUsers.length }));
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get('/api/superadmin/all-users');
      setAllUsers(response.data);
    } catch (error) {
      console.error('Error fetching all users:', error);
      // Mock data for demo
      const mockUsers = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['Active', 'Pending', 'Suspended'][Math.floor(Math.random() * 3)],
        role: ['User', 'Admin', 'Premium'][Math.floor(Math.random() * 3)],
        lastLogin: ['2 hours ago', '1 day ago', '3 days ago'][Math.floor(Math.random() * 3)]
      }));
      setAllUsers(mockUsers);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/superadmin/dashboard-stats');
      setStats(response.data);
      setSnackbarMessage('Data updated successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Enhanced mock data
      setStats({
        totalUsers: 12847,
        totalAdmins: 156,
        verifiedAdmins: 142,
        pendingAdmins: 14,
        newUsers: 89,
        totalRevenue: 285420,
        dailyActiveUsers: 3247,
        pendingRequests: 45,
        completedRequests: 1205,
        rejectedRequests: 23,
        suspendedUsers: 12,
        totalTransactions: 5683,
        averageSessionDuration: 24,
        systemAlerts: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get('/api/superadmin/revenue-stats');
      setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      setRevenueData({ 
        totalRevenue: 285420, 
        monthlyRevenue: [45000, 52000, 48000, 65000, 71000, 85420] 
      });
    }
  };

  const fetchRequestData = async () => {
    try {
      const response = await axios.get('/api/superadmin/request-stats');
      setRequestData(response.data);
    } catch (error) {
      console.error('Error fetching request data:', error);
      setRequestData({ pending: 45, completed: 1205, rejected: 23, inProgress: 78 });
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
        case 'revenue':
          endpoint = '/api/superadmin/revenue-details';
          title = 'Revenue Details';
          break;
        default:
          return;
      }

      const response = await axios.get(endpoint);
      setDialogData({
        title,
        data: response.data || allUsers.slice(0, 10),
        type
      });
      setDialogOpen(true);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      // Use mock data for demo
      setDialogData({
        data: allUsers.slice(0, 10),
        type
      });
      setDialogOpen(true);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchAllData();
    setSnackbarMessage('Refreshing all data...');
    setSnackbarOpen(true);
  };

  const handleAutoRefreshToggle = (event) => {
    setAutoRefresh(event.target.checked);
    setSnackbarMessage(event.target.checked ? 'Auto-refresh enabled' : 'Auto-refresh disabled');
    setSnackbarOpen(true);
  };

  const chartData = [stats.totalUsers, stats.totalAdmins, stats.verifiedAdmins, stats.pendingAdmins, stats.newUsers];
  const chartLabels = ['Users', 'Admins', 'Verified', 'Pending', 'New Joined'];
  const chartColors = ['#2196F3', '#FF9800', '#4CAF50', '#F44336', '#673AB7'];

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Enhanced Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <DashboardIcon sx={{ mr: 2, fontSize: 40 }} />
            Super Admin Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 7 }}>
            Real-time platform analytics and management center
          </Typography>
          <Box display="flex" alignItems="center" mt={1} ml={7}>
            <Typography variant="caption" color="text.secondary" mr={1}>
              Last updated: {new Date().toLocaleTimeString()}
            </Typography>
            <Chip 
              label={autoRefresh ? "Live" : "Manual"} 
              color={autoRefresh ? "success" : "default"} 
              size="small" 
            />
          </Box>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={handleAutoRefreshToggle}
                color="primary"
              />
            }
            label="Auto-refresh"
          />
          <Tooltip title="Refresh All Data">
            <IconButton 
              onClick={handleRefresh} 
              sx={{ 
                bgcolor: 'white', 
                boxShadow: 2,
                '&:hover': { bgcolor: 'primary.light', color: 'white' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Report">
            <IconButton sx={{ 
              bgcolor: 'white', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'success.light', color: 'white' }
            }}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Data">
            <IconButton sx={{ 
              bgcolor: 'white', 
              boxShadow: 2,
              '&:hover': { bgcolor: 'info.light', color: 'white' }
            }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Enhanced Statistics Cards - Full Width */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={loading ? '...' : stats.totalUsers?.toLocaleString()}
            icon={<PeopleIcon />}
            color="#2196F3"
            loading={loading}
            trend="12"
            subtitle="Registered platform users"
            onClick={() => handleCardClick('users')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Admins"
            value={loading ? '...' : stats.totalAdmins}
            icon={<AdminIcon />}
            color="#FF9800"
            loading={loading}
            trend="8"
            subtitle="Admin accounts"
            onClick={() => handleCardClick('admins')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={loading ? '...' : `${stats.totalRevenue?.toLocaleString()}`}
            icon={<MoneyIcon />}
            color="#4CAF50"
            loading={loading}
            trend="24"
            subtitle="Platform earnings"
            onClick={() => handleCardClick('revenue')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Daily Active"
            value={loading ? '...' : stats.dailyActiveUsers?.toLocaleString()}
            icon={<TrendingUpIcon />}
            color="#9C27B0"
            loading={loading}
            trend="5"
            subtitle="Active users today"
          />
        </Grid>
      </Grid>

      {/* Additional Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Transactions"
            value={loading ? '...' : stats.totalTransactions?.toLocaleString()}
            icon={<ShoppingCartIcon />}
            color="#00BCD4"
            loading={loading}
            trend="18"
            subtitle="Total transactions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Suspended Users"
            value={loading ? '...' : stats.suspendedUsers}
            icon={<PersonOffIcon />}
            color="#F44336"
            loading={loading}
            trendDirection="down"
            trend="3"
            subtitle="Account suspensions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Avg Session"
            value={loading ? '...' : `${stats.averageSessionDuration}min`}
            icon={<ScheduleIcon />}
            color="#795548"
            loading={loading}
            trend="7"
            subtitle="User engagement"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="System Alerts"
            value={loading ? '...' : stats.systemAlerts}
            icon={<WarningIcon />}
            color="#FF5722"
            loading={loading}
            subtitle="Require attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="New Users"
            value={loading ? '...' : stats.newUsers}
            icon={<PersonAddIcon />}
            color="#673AB7"
            loading={loading}
            trend="18"
            subtitle="Last 7 days"
          />
        </Grid>
      </Grid>

      {/* Tabbed Content Section */}
      <Paper sx={{ mb: 4, borderRadius: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Analytics Overview" />
          <Tab label="User Management" />
          <Tab label="System Health" />
          <Tab label="Revenue Reports" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <RevenueChart data={revenueData} loading={loading} />
              </Grid>
              <Grid item xs={12} lg={4}>
                <RequestStatusChart data={requestData} />
              </Grid>
            </Grid>
          )}
          
          {tabValue === 1 && (
            <UserManagementTable users={allUsers} />
          )}
          
          {tabValue === 2 && (
            <SystemHealthMonitor />
          )}
          
          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, height: '400px' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <LocalAtmIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Revenue Breakdown
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    {[
                      { label: 'Subscription Fees', amount: '$185,420', percentage: 65, color: '#4CAF50' },
                      { label: 'Premium Features', amount: '$65,200', percentage: 23, color: '#2196F3' },
                      { label: 'Admin Licenses', amount: '$25,800', percentage: 9, color: '#FF9800' },
                      { label: 'Other Services', amount: '$9,000', percentage: 3, color: '#9C27B0' }
                    ].map((item, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight="medium">
                            {item.label}
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color={item.color}>
                            {item.amount}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={item.percentage}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: alpha(item.color, 0.15),
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: item.color,
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                          {item.percentage}% of total revenue
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, height: '400px' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Payment Methods
                  </Typography>
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    {[
                      { method: 'Credit Card', transactions: 3420, amount: '$245,600', color: '#4CAF50' },
                      { method: 'PayPal', transactions: 1250, amount: '$89,400', color: '#2196F3' },
                      { method: 'Bank Transfer', transactions: 680, amount: '$45,200', color: '#FF9800' },
                      { method: 'Crypto', transactions: 145, amount: '$12,800', color: '#9C27B0' }
                    ].map((payment, index) => (
                      <Grid item xs={12} key={index}>
                        <Box 
                          sx={{ 
                            p: 2, 
                            border: `2px solid ${alpha(payment.color, 0.3)}`,
                            borderRadius: 2,
                            backgroundColor: alpha(payment.color, 0.05)
                          }}
                        >
                          <Typography variant="body1" fontWeight="bold" mb={1}>
                            {payment.method}
                          </Typography>
                          <Typography variant="h6" color={payment.color} fontWeight="bold">
                            {payment.amount}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {payment.transactions} transactions
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Full Width Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 4, borderRadius: 3, height: '500px' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              Platform Analytics Overview
            </Typography>
            <Box sx={{ height: '420px', mt: 2 }}>
              <SuperAdminSimpleBarChart 
                data={chartData}
                labels={chartLabels}
                colors={chartColors}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ActivityFeed activities={activities} />
        </Grid>
      </Grid>

      {/* Enhanced Time Series Charts - Full Width */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Growth Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <TimeSeriesLineChart 
                  title="User Growth Trend" 
                  type="users" 
                  color="#2196F3" 
                  total={stats.totalUsers} 
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TimeSeriesLineChart 
                  title="Revenue Growth Trend" 
                  type="revenue" 
                  color="#4CAF50" 
                  total={stats.totalRevenue} 
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Request Management Section - Full Width */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              <RequestIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Request Management Dashboard
            </Typography>
            <Grid container spacing={3} mt={1}>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} sx={{ bgcolor: alpha('#ff9800', 0.1), borderRadius: 2 }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#ff9800">
                    {requestData.pending}
                  </Typography>
                  <Typography variant="body2">Pending</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} sx={{ bgcolor: alpha('#2196f3', 0.1), borderRadius: 2 }}>
                  <RefreshIcon sx={{ fontSize: 40, color: '#2196f3', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#2196f3">
                    {requestData.inProgress}
                  </Typography>
                  <Typography variant="body2">In Progress</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} sx={{ bgcolor: alpha('#4caf50', 0.1), borderRadius: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#4caf50">
                    {requestData.completed}
                  </Typography>
                  <Typography variant="body2">Completed</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box textAlign="center" p={2} sx={{ bgcolor: alpha('#f44336', 0.1), borderRadius: 2 }}>
                  <CloseIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="#f44336">
                    {requestData.rejected}
                  </Typography>
                  <Typography variant="body2">Rejected</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
       
      </Grid>

      {/* Enhanced Tables Section - Full Width */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 3, backgroundColor: 'primary.main', color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Admin Plan Purchases & Revenue Analytics
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Complete overview of subscription purchases and revenue generation
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <AdminPlanPurchaseTable />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Users Table - Full Width */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ p: 3, backgroundColor: 'success.main', color: 'white' }}>
              <Typography variant="h6" fontWeight="bold">
                <PersonAddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent New Users Registration
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                Latest user registrations and onboarding status
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <NewUsersTable users={newUsersList} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Detail Dialog */}
      <DetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogData.title}
        data={dialogData.data}
        type={dialogData.type}
      />

      {/* Enhanced Floating Action Button with Multiple Options */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1976D2 30%, #1BA8D8 90%)',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease'
        }}
        onClick={() => handleCardClick('pending')}
      >
        <Badge badgeContent={stats.pendingRequests} color="error">
          <AssignmentIcon />
        </Badge>
      </Fab>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default SuperAdminDashboard;