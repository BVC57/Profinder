import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Badge,
  IconButton,
  Box,
  CircularProgress,
  Divider,
  Chip,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Notifications as NotificationsIcon, 
  CheckCircle, 
  Error, 
  Info, 
  Work, 
  DoneAll,
  MarkEmailRead,
  MarkEmailUnread,
  ClearAll
} from '@mui/icons-material';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const typeIcon = {
  user_request: <Work color="primary" />, // New request for admin
  user_request_created: <Info color="info" />, // New request in system
  request_approved: <CheckCircle color="success" />,
  request_rejected: <Error color="error" />,
  request_status_updated: <DoneAll color="primary" />,
};

const getTypeColor = (type) => {
  switch (type) {
    case 'user_request':
      return '#1976d2';
    case 'user_request_created':
      return '#0288d1';
    case 'request_approved':
      return '#2e7d32';
    case 'request_rejected':
      return '#d32f2f';
    case 'request_status_updated':
      return '#1976d2';
    default:
      return '#757575';
  }
};

const NotificationList = ({ onNotificationRead }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError('');
        let res;
        if (user?.role === 'admin') {
          res = await axios.get('/api/notification');
        } else if (user?.role === 'user' || user?.role === 'superadmin') {
          res = await axios.get('/api/notification');
        }
        setNotifications(res?.data || []);
        setUnreadCount((res?.data || []).filter(n => !n.read).length);
      } catch (err) {
        setError('Failed to fetch notifications.');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.read) {
      try {
        await axios.patch(`/api/notification/${notification._id}/read`);
        setNotifications((prev) => prev.map(n => n._id === notification._id ? { ...n, read: true } : n));
        setUnreadCount((prev) => Math.max(0, prev - 1));
        // Call parent callback to update navbar count
        if (onNotificationRead) {
          onNotificationRead();
        }
      } catch {}
    }
    
    // Navigate to related request if available
    if (notification.relatedUserRequest) {
      // Navigate to admin dashboard with state to set active section to requests
      navigate('/admin-dashboard', { state: { activeSection: 'requests' } });
      // Close the popover if it's open (for navbar notifications)
      if (onNotificationRead) {
        // This indicates it's in a popover, so close it
        setTimeout(() => {
          // You can add a callback to close the popover here if needed
        }, 100);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.patch('/api/notification/mark-all-read');
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      if (onNotificationRead) {
        onNotificationRead();
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ bgcolor: '#fff3e0', border: '1px solid #ff9800' }}>
        <CardContent>
          <Typography color="error" align="center">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  const renderNotificationItem = (notification) => (
    <Card
      key={notification._id}
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: !notification.read ? '2px solid #1976d2' : '1px solid #e0e0e0',
        bgcolor: !notification.read ? '#f3f8ff' : '#ffffff',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderColor: '#1976d2'
        }
      }}
      onClick={() => handleNotificationClick(notification)}
    >
      <CardContent sx={{ py: 2, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: getTypeColor(notification.type),
              width: 40,
              height: 40,
              mt: 0.5
            }}
          >
            {typeIcon[notification.type] || <Info />}
          </Avatar>
          
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: !notification.read ? 600 : 400,
                  color: !notification.read ? '#1976d2' : 'text.primary'
                }}
              >
                {notification.title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                {!notification.read && (
                  <Chip
                    label="New"
                    size="small"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
                <Typography variant="caption" color="text.secondary">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </Box>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, lineHeight: 1.5 }}
            >
              {notification.message}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {new Date(notification.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 3,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon sx={{ fontSize: 28, color: '#1976d2' }} />
          </Badge>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2' }}>
            Notifications
          </Typography>
        </Box>
        
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
            onClick={handleMarkAllAsRead}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              minHeight: 48
            }
          }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MarkEmailUnread />
                <Typography>Unread ({unreadNotifications.length})</Typography>
              </Box>
            }
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MarkEmailRead />
                <Typography>Read ({readNotifications.length})</Typography>
              </Box>
            }
          />
        </Tabs>
      </Paper>

      {/* Content */}
      {activeTab === 0 && (
        <Box>
          {unreadNotifications.length === 0 ? (
            <Card sx={{ bgcolor: '#f5f5f5', textAlign: 'center', py: 4 }}>
              <CardContent>
                <MarkEmailRead sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  All Caught Up!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You have no unread notifications
                </Typography>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map(renderNotificationItem)
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {readNotifications.length === 0 ? (
            <Card sx={{ bgcolor: '#f5f5f5', textAlign: 'center', py: 4 }}>
              <CardContent>
                <MarkEmailRead sx={{ fontSize: 48, color: '#9e9e9e', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Read Notifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You haven't read any notifications yet
                </Typography>
              </CardContent>
            </Card>
          ) : (
            readNotifications.map(renderNotificationItem)
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationList; 