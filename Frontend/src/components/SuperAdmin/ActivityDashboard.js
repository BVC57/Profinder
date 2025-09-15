import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  Done as DoneIcon
} from '@mui/icons-material';
import axios from '../../api/axios';

const actionTypeConfig = {
  request_created: { color: 'primary', label: 'Request Created', icon: <WorkIcon /> },
  request_approved: { color: 'success', label: 'Request Approved', icon: <CheckIcon /> },
  request_rejected: { color: 'error', label: 'Request Rejected', icon: <CancelIcon /> },
  request_in_progress: { color: 'warning', label: 'Work Started', icon: <ScheduleIcon /> },
  request_completed: { color: 'success', label: 'Work Completed', icon: <DoneIcon /> },
  admin_verified: { color: 'success', label: 'Admin Verified', icon: <CheckIcon /> },
  admin_rejected: { color: 'error', label: 'Admin Rejected', icon: <CancelIcon /> }
};

const ActivityDashboard = () => {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState({
    actionType: '',
    search: '',
    startDate: '',
    endDate: ''
  });
  
  // Detail dialog
  const [detailDialog, setDetailDialog] = useState({ open: false, activity: null });

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchActivities();
    fetchStats();
  }, [page, rowsPerPage, filters]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters
      });
      
      const response = await axios.get(`/api/activities?${params}`);
      setActivities(response.data.activities);
      setTotalItems(response.data.pagination.totalItems);
    } catch (error) {
      setError('Failed to fetch activities');
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/activities/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0); // Reset to first page when filtering
  };

  const handleViewDetails = (activity) => {
    setDetailDialog({ open: true, activity });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && activities.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.totalActivities || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Activities</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ScheduleIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.recentActivities || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Last 7 Days</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">{stats.topUsers?.length || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">Active Users</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h4">
                    {stats.actionTypeStats?.find(s => s._id === 'request_created')?.count || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Requests Created</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <FilterIcon sx={{ mr: 1 }} />
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search by title, user, or admin..."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Action Type</InputLabel>
              <Select
                value={filters.actionType}
                onChange={(e) => handleFilterChange('actionType', e.target.value)}
                label="Action Type"
              >
                <MenuItem value="">All Actions</MenuItem>
                <MenuItem value="request_created">Request Created</MenuItem>
                <MenuItem value="request_approved">Request Approved</MenuItem>
                <MenuItem value="request_rejected">Request Rejected</MenuItem>
                <MenuItem value="request_in_progress">Work Started</MenuItem>
                <MenuItem value="request_completed">Work Completed</MenuItem>
                <MenuItem value="admin_verified">Admin Verified</MenuItem>
                <MenuItem value="admin_rejected">Admin Rejected</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Activities Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Request</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activities.map((activity) => {
                const actionConfig = actionTypeConfig[activity.actionType] || { color: 'default', label: activity.actionType };
                return (
                  <TableRow key={activity._id}>
                    <TableCell>
                      <Chip
                        icon={actionConfig.icon}
                        label={actionConfig.label}
                        color={actionConfig.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {activity.user?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.user?.email} ({activity.user?.role})
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {activity.admin ? (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {activity.details?.adminName || activity.admin?.profession}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.admin?.city}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {activity.request ? (
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {activity.details?.requestTitle || activity.request?.title}
                          </Typography>
                          <Chip 
                            label={activity.request?.status} 
                            size="small" 
                            color={activity.request?.status === 'completed' ? 'success' : 'default'}
                          />
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">-</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {activity.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(activity.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(activity)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={totalItems}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50, 100]}
        />
      </Paper>

      {/* Detail Dialog */}
      <Dialog 
        open={detailDialog.open} 
        onClose={() => setDetailDialog({ open: false, activity: null })}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: 22, pb: 0 }}>
          Activity Details
        </DialogTitle>
        <DialogContent dividers sx={{ p: { xs: 1, sm: 3 } }}>
          {detailDialog.activity && (
            <Box>
              <Grid container spacing={3} direction={isSmallScreen ? 'column' : 'row'}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    User Information
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2"><strong>Name:</strong> {detailDialog.activity.user?.name}</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {detailDialog.activity.user?.email}</Typography>
                    <Typography variant="body2"><strong>Role:</strong> {detailDialog.activity.user?.role}</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Action Details
                  </Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2"><strong>Type:</strong> {actionTypeConfig[detailDialog.activity.actionType]?.label}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {formatDate(detailDialog.activity.createdAt)}</Typography>
                    <Typography variant="body2"><strong>Description:</strong> {detailDialog.activity.description}</Typography>
                  </Stack>
                </Grid>
                {detailDialog.activity.admin && (
                  <Grid item xs={12} md={6}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Admin Information
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2"><strong>Name:</strong> {detailDialog.activity.details?.adminName}</Typography>
                      <Typography variant="body2"><strong>Profession:</strong> {detailDialog.activity.admin?.profession}</Typography>
                      <Typography variant="body2"><strong>City:</strong> {detailDialog.activity.admin?.city}</Typography>
                    </Stack>
                  </Grid>
                )}
                {detailDialog.activity.request && (
                  <Grid item xs={12} md={6}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Request Information
                    </Typography>
                    <Stack spacing={0.5}>
                      <Typography variant="body2"><strong>Title:</strong> {detailDialog.activity.details?.requestTitle}</Typography>
                      <Typography variant="body2"><strong>Status:</strong> {detailDialog.activity.request?.status}</Typography>
                      {detailDialog.activity.details?.notes && (
                        <Typography variant="body2"><strong>Notes:</strong> {detailDialog.activity.details.notes}</Typography>
                      )}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog({ open: false, activity: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ActivityDashboard; 