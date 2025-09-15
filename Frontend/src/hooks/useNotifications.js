import { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import axios from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axios.get('/api/notifications');
      let filteredNotifications = response.data;
      
      // For super admin, only show admin verification related notifications
      if (user?.role === 'superadmin') {
        filteredNotifications = response.data.filter(notification => 
          ['admin_verification_request', 'admin_verified', 'admin_rejected'].includes(notification.type)
        );
      }
      
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user?.role]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await axios.get('/api/notifications/unread-count');
      let unreadCount = response.data.count;
      
      // For super admin, only count admin verification related notifications
      if (user?.role === 'superadmin') {
        const allNotifications = await axios.get('/api/notifications');
        const adminVerificationNotifications = allNotifications.data.filter(notification => 
          ['admin_verification_request', 'admin_verified', 'admin_rejected'].includes(notification.type) && !notification.read
        );
        unreadCount = adminVerificationNotifications.length;
      }
      
      setUnreadCount(unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [user?.role]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.patch(`/api/notifications/${notificationId}/read`);
      setNotifications(prev => 
        prev.map(notification => 
          notification._id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      );
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      if (user?.role === 'superadmin') {
        // For super admin, only mark admin verification notifications as read
        const adminVerificationNotifications = notifications.filter(notification => 
          ['admin_verification_request', 'admin_verified', 'admin_rejected'].includes(notification.type) && !notification.read
        );
        
        // Mark each admin verification notification as read
        for (const notification of adminVerificationNotifications) {
          await axios.patch(`/api/notifications/${notification._id}/read`);
        }
        
        setNotifications(prev => 
          prev.map(notification => 
            ['admin_verification_request', 'admin_verified', 'admin_rejected'].includes(notification.type)
              ? { ...notification, read: true }
              : notification
          )
        );
      } else {
        // For other users, mark all notifications as read
        await axios.patch('/api/notifications/mark-all-read');
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.role, notifications]);

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Connected to notification server');
        newSocket.emit('join-superadmin');
      });

      newSocket.on('new-admin-verification', (data) => {
        console.log('New admin verification notification:', data);
        // Fetch updated notifications
        fetchNotifications();
        fetchUnreadCount();
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from notification server');
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [isAuthenticated, user?.role, fetchNotifications, fetchUnreadCount]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin') {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [isAuthenticated, user?.role, fetchNotifications, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 