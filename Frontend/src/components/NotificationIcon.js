import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Chip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AdminPanelSettings as AdminIcon,
  CheckCircle as VerifiedIcon,
  Schedule as PendingIcon,
  Assignment as RequestIcon,
  Person as UserIcon
} from '@mui/icons-material';
import { useNotifications } from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NotificationIcon = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if not already read
      if (!notification.read) {
        console.log('Marking notification as read:', notification._id);
        await markAsRead(notification._id);
      }
      
      // Navigate based on notification type and user role
      switch (notification.type) {
        case 'admin_verification_request':
        case 'admin_verified':
        case 'admin_rejected':
          if (user.role === 'superadmin') {
            // Navigate to super admin panel with pending admins section active
            navigate('/super-admin', { state: { activeSection: 'pending-admins' } });
          }
          break;
        case 'user_request':
        case 'user_request_created':
        case 'request_approved':
        case 'request_rejected':
        case 'request_status_updated':
          // For non-super admin users, navigate to requests
          if (user.role !== 'superadmin') {
            navigate('/requests');
          }
          break;
        default:
          // Default navigation
          if (user.role === 'superadmin') {
            navigate('/super-admin');
          } else if (user.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/requests');
          }
      }
      
      handleClose();
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      console.log('Marking all notifications as read');
      await markAllAsRead();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'admin_verification_request':
        return <PendingIcon color="warning" />;
      case 'admin_verified':
        return <VerifiedIcon color="success" />;
      case 'admin_rejected':
        return <AdminIcon color="error" />;
      case 'user_request':
      case 'user_request_created':
        return <RequestIcon color="primary" />;
      case 'request_approved':
        return <VerifiedIcon color="success" />;
      case 'request_rejected':
        return <AdminIcon color="error" />;
      case 'request_status_updated':
        return <RequestIcon color="info" />;
      default:
        return <AdminIcon color="primary" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'admin_verification_request':
        return 'warning';
      case 'admin_verified':
      case 'request_approved':
        return 'success';
      case 'admin_rejected':
      case 'request_rejected':
        return 'error';
      case 'user_request':
      case 'user_request_created':
        return 'primary';
      case 'request_status_updated':
        return 'info';
      default:
        return 'primary';
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      {/* <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 1 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
       */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {user?.role === 'superadmin' ? 'Admin Verification Notifications' : 'Notifications'}
            </Typography>
            {unreadCount > 0 && (
              <Button 
                size="small" 
                onClick={handleMarkAllRead}
                variant="outlined"
                color="primary"
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>
        
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary={user?.role === 'superadmin' ? "No admin verification notifications" : "No notifications"}
                secondary={user?.role === 'superadmin' ? "No pending admin verification requests" : "You're all caught up!"}
              />
            </ListItem>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem 
                  button 
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      backgroundColor: 'action.selected'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent' }}>
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: notification.read ? 'normal' : 'bold',
                            flex: 1
                          }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Chip 
                            label="New" 
                            size="small" 
                            color={getNotificationColor(notification.type)}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          )}
        </List>
        
        {notifications.length > 10 && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Showing 10 of {notifications.length} {user?.role === 'superadmin' ? 'admin verification' : ''} notifications
            </Typography>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default NotificationIcon; 