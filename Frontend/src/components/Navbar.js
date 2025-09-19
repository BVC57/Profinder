import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Box,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Popover,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as SuperAdminIcon,
  VerifiedUser as VerifiedIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Assignment as FormIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Assignment as RequestIcon,
  Info as AboutIcon,
  Notifications as NotificationsIcon,
  Lock as LockIcon,
  History as HistoryIcon,
  Close as CloseIcon,
  ContactSupport as ContactIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
// Removed PaymentHistoryContext import
import NotificationIcon from './NotificationIcon';
import NotificationList from './NotificationList';
import UserProfileUpdateDialog from './UserProfileUpdateDialog';
import ChangePasswordDialog from './ChangePasswordDialog';
import axios from '../api/axios';
import logo from '../assets/logo.png'; // Adjust path if needed

import SidebarDrawer from './SidebarDrawer';
import PaymentHistoryCard from './PaymentHistoryCard';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bellAnchorEl, setBellAnchorEl] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [profileUpdateOpen, setProfileUpdateOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loadingPaymentHistory, setLoadingPaymentHistory] = useState(false);
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { sidebarOpen, toggleSidebar } = useSidebar();

  // Fetch unread notification count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (isAuthenticated && !loading) {
        try {
          const response = await axios.get('/api/notification/unread-count');
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, loading]);

  const userName = user?.name || 'User';
  const handleLogout = () => {
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const fetchPaymentHistory = async () => {
    if (!user || !user.id) return;
    
    setLoadingPaymentHistory(true);
    try {
      const response = await axios.get(`/api/admin/payments/user/${user.id}`);
      if (response.data.success && response.data.payments) {
        // Transform the data to match the expected format
        const formattedPayments = response.data.payments.map(payment => ({
          id: payment._id,
          adminName: payment.adminName || 'Unknown',
          adminProfession: payment.adminProfession || 'Professional',
          paymentDate: payment.createdAt,
          status: payment.paymentStatus.toLowerCase(),
          serviceType: payment.paymentType,
          amount: payment.amount,
          requestId: payment.requestId,
          description: payment.description,
          preferredDate: payment.preferredDate,
          preferredTime: payment.preferredTime,
          razorpayOrderId: payment.razorpayOrderId,
          razorpayPaymentId: payment.razorpayPaymentId,
          error: payment.failureReason
        }));
        setPaymentHistory(formattedPayments);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoadingPaymentHistory(false);
    }
  };

  const handlePaymentHistoryOpen = () => {
    setPaymentHistoryOpen(true);
    handleProfileMenuClose();
    fetchPaymentHistory();
  };

  const handleProfileUpdate = () => {
    setProfileUpdateOpen(true);
    handleProfileMenuClose();
  };

  const handleProfileUpdateClose = () => {
    setProfileUpdateOpen(false);
  };

  const handleChangePasswordOpen = () => {
    setChangePasswordOpen(true);
    handleProfileMenuClose();
  };

  const handleChangePasswordClose = () => setChangePasswordOpen(false);

  // Function to get profile photo URL
  const getProfilePhotoUrl = () => {
    if (user?.profilePhoto) {
      return `${process.env.REACT_APP_API_URL || 'http://192.168.31.3:5000'}/uploads/${user.profilePhoto}`;
    }
    return null;
  };

  // Function to handle profile photo load error
  const handleProfilePhotoError = (event) => {
    console.log('Profile photo failed to load, using fallback');
    event.target.style.display = 'none';
  };


  // Redirect superadmin and admin from / to their dashboards after login
  useEffect(() => {
    if (isAuthenticated && user?.role === 'superadmin' && location.pathname === '/') {
      navigate('/super-admin', { replace: true });
    }
    if (isAuthenticated && user?.role === 'admin' && location.pathname === '/') {
      navigate('/admin-dashboard', { replace: true });
    }
    // If logged in and on /register, redirect to appropriate dashboard
    if (isAuthenticated && location.pathname === '/register') {
      if (user?.role === 'superadmin') {
        navigate('/super-admin', { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  // Show loading spinner while authentication state is being determined
  if (loading) {
    return (
      <AppBar position="sticky" elevation={2} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: 'primary.main',
              fontWeight: 'bold'
            }}
          >
            ProFinder
          </Typography>
          <CircularProgress size={24} color="primary" />
        </Toolbar>
      </AppBar>
    );
  }

  const menuItems = [
    // Not authenticated: show Home, About Us, Login
    ...(!isAuthenticated ? [
      { text: 'Home', path: '/', icon: <HomeIcon /> },
      { text: 'About Us', path: '/about', icon: <AboutIcon /> },
      { text: 'Login', path: '/login', icon: <LoginIcon /> },
    ] : []),
    // Superadmin: show superadmin menus
    ...(isAuthenticated && user?.role === 'superadmin' ? [
      { text: 'Super Admin Panel', path: '/super-admin', icon: <SuperAdminIcon /> },
      // { text: 'Home', path: '/', icon: <HomeIcon /> },
      // { text: 'About Us', path: '/about', icon: <AboutIcon /> },
      // { text: 'Super Admin Panel', path: '/super-admin', icon: <SuperAdminIcon /> },
      // { text: 'User Data Dashboard', path: '/user-data-dashboard', icon: <DashboardIcon /> },
    ] : []),
    // User: show user menus
    ...(isAuthenticated && user?.role === 'user' ? [
      { text: 'Home', path: '/', icon: <HomeIcon /> },
      { text: 'About Us', path: '/about', icon: <AboutIcon /> },
      { text: 'Contact Us', path: '/contact', icon: <ContactIcon /> },
      { text: 'Become Professional', path: '/joinus', icon: <FormIcon /> },
    ] : []),
    // Admin: show admin menus
    ...(isAuthenticated && user?.role === 'admin' ? [
      // { text: 'Home', path: '/', icon: <HomeIcon /> },
      // { text: 'About Us', path: '/about', icon: <AboutIcon /> },
    ] : []),
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    toggleSidebar();
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  
  const handleBellClick = (event) => setBellAnchorEl(event.currentTarget);
  const handleBellClose = () => setBellAnchorEl(null);
  const bellOpen = Boolean(bellAnchorEl);


  const drawer = (
    <SidebarDrawer
      isAuthenticated={isAuthenticated}
      userName={userName}
      menuItems={menuItems}
      isActive={isActive}
      handleNavigation={(path) => { handleNavigation(path); setMobileOpen(false); }}
      handleProfileUpdate={handleProfileUpdate}
      handleChangePasswordOpen={handleChangePasswordOpen}
      handleLogout={handleLogout}
    />
  );

  return (
    <>
      <AppBar position="sticky" elevation={2} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              ...(isAuthenticated && user?.role === 'superadmin' && location.pathname === '/super-admin' && {
                display: 'none'
              }),
              ...(isAuthenticated && user?.role === 'admin' && location.pathname === '/admin-dashboard' && {
                display: 'none'
              })
            }}
          >
            <MenuIcon />
          </IconButton>
          {/* Sidebar toggle for Super Admin and Admin Dashboard */}
          {(isAuthenticated && user?.role === 'superadmin' && location.pathname === '/super-admin') && (
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ 
                mr: 2, 
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.08)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          {(isAuthenticated && user?.role === 'admin' && location.pathname === '/admin-dashboard') && (
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ 
                mr: 2, 
                backgroundColor: 'rgba(0,0,0,0.04)',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.08)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: 'primary.main',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={() => handleNavigation('/')}
          >
            <img 
              src={logo} 
              alt="ProFinder Logo" 
              style={{ height: 32, marginRight: 8 }} 
            />
            ProFinder
          </Typography>
          

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    backgroundColor: isActive(item.path) ? 'primary.main' : 'transparent',
                    color: isActive(item.path) ? 'white' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive(item.path) ? 'primary.dark' : 'action.hover',
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
              
              {isAuthenticated && (
                <>
                  <IconButton color="inherit" onClick={handleBellClick} sx={{ ml: 1 }}>
                    <Badge badgeContent={unreadCount} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <Popover
                    open={bellOpen}
                    anchorEl={bellAnchorEl}
                    onClose={handleBellClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
                  >
                    <NotificationList 
                      onNotificationRead={() => {
                        setUnreadCount(prev => Math.max(0, prev - 1));
                        handleBellClose(); // Close popover when notification is clicked
                      }} 
                    />
                  </Popover>
                  {user?.role === 'superadmin' && <NotificationIcon />}
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ ml: 1 }}
                  >
                    <Avatar 
                      src={getProfilePhotoUrl()}
                      onError={handleProfilePhotoError}
                      sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: 'primary.main',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={handleProfileUpdate}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      Update Profile
                    </MenuItem>
                    <MenuItem onClick={handleChangePasswordOpen}>
                      <ListItemIcon>
                        <LockIcon fontSize="small" />
                      </ListItemIcon>
                      Change Password
                    </MenuItem>
                    {/* <MenuItem onClick={() => { handleNavigation('/admin-profile'); handleProfileMenuClose(); }}>
                      <ListItemIcon>
                        <PersonIcon fontSize="small" />
                      </ListItemIcon>
                      View Profile
                    </MenuItem> */}
                    {user?.role === 'user' && (
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/requests'); }}>
                        <ListItemIcon>
                          <RequestIcon fontSize="small" />
                        </ListItemIcon>
                        My Requests
                      </MenuItem>
                    )}
                    {user?.role === 'user' && (
                      <MenuItem onClick={handlePaymentHistoryOpen}>
                        <ListItemIcon>
                          <HistoryIcon fontSize="small" />
                        </ListItemIcon>
                        Payment History
                      </MenuItem>
                    )}
                    {user?.role === 'admin' && (
                      <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard', { state: { activeSection: 'requests' } }); }}>
                        <ListItemIcon>
                          <RequestIcon fontSize="small" />
                        </ListItemIcon>
                        Request Management
                      </MenuItem>
                    )}
                    {/* <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/notifications'); }}>
                      <ListItemIcon>
                        <NotificationsIcon fontSize="small" />
                      </ListItemIcon>
                      Notifications
                    </MenuItem> */}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          )}
          {isMobile && isAuthenticated && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton color="inherit" onClick={handleBellClick} size="large">
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Popover
                open={bellOpen}
                anchorEl={bellAnchorEl}
                onClose={handleBellClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
              >
                <NotificationList 
                  onNotificationRead={() => {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                    handleBellClose();
                  }} 
                />
              </Popover>
              <IconButton onClick={handleProfileMenuOpen} size="large">
                <Avatar 
                  src={getProfilePhotoUrl()}
                  onError={handleProfilePhotoError}
                  sx={{ 
                    width: 32, 
                    height: 32, 
                    bgcolor: 'primary.main',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleProfileUpdate}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  Update Profile
                </MenuItem>
                <MenuItem onClick={handleChangePasswordOpen}>
                  <ListItemIcon>
                    <LockIcon fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>
                {/* <MenuItem onClick={() => { handleNavigation('/admin-profile'); handleProfileMenuClose(); }}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  View Profile
                </MenuItem> */}
                {user?.role === 'user' && (
                  <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/requests'); }}>
                    <ListItemIcon>
                      <RequestIcon fontSize="small" />
                    </ListItemIcon>
                    My Requests
                  </MenuItem>
                )}
                {user?.role === 'user' && (
                  <MenuItem onClick={handlePaymentHistoryOpen}>
                    <ListItemIcon>
                      <HistoryIcon fontSize="small" />
                    </ListItemIcon>
                    Payment History
                  </MenuItem>
                )}
                {user?.role === 'admin' && (
                  <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard', { state: { activeSection: 'requests' } }); }}>
                    <ListItemIcon>
                      <RequestIcon fontSize="small" />
                    </ListItemIcon>
                    Request Management
                  </MenuItem>
                )}
                {/* <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/notifications'); }}>
                  <ListItemIcon>
                    <NotificationsIcon fontSize="small" />
                  </ListItemIcon>
                  Notifications
                </MenuItem> */}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
        {isMobile && isAuthenticated && user?.role !== 'admin' && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1, gap: 1 }}>
            {/* <IconButton color="inherit" onClick={handleBellClick} size="large">
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Popover
              open={bellOpen}
              anchorEl={bellAnchorEl}
              onClose={handleBellClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{ sx: { width: 350, maxHeight: 400 } }}
            >
              <NotificationList 
                onNotificationRead={() => {
                  setUnreadCount(prev => Math.max(0, prev - 1));
                  handleBellClose();
                }} 
              />
            </Popover> */}
            {/* <IconButton onClick={handleProfileMenuOpen} size="large">
              <Avatar 
                src={getProfilePhotoUrl()}
                onError={handleProfilePhotoError}
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton> */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleProfileUpdate}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                Update Profile
              </MenuItem>
              <MenuItem onClick={handleChangePasswordOpen}>
                <ListItemIcon>
                  <LockIcon fontSize="small" />
                </ListItemIcon>
                Change Password
              </MenuItem>
              {/* <MenuItem onClick={() => { handleNavigation('/admin-profile'); handleProfileMenuClose(); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                View Profile
              </MenuItem> */}
              {user?.role === 'user' && (
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/requests'); }}>
                  <ListItemIcon>
                    <RequestIcon fontSize="small" />
                  </ListItemIcon>
                  My Requests
                </MenuItem>
              )}
              {user?.role === 'user' && (
                <MenuItem onClick={handlePaymentHistoryOpen}>
                  <ListItemIcon>
                    <HistoryIcon fontSize="small" />
                  </ListItemIcon>
                  Payment History
                </MenuItem>
              )}
              {user?.role === 'admin' && (
                <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/admin-dashboard', { state: { activeSection: 'requests' } }); }}>
                  <ListItemIcon>
                    <RequestIcon fontSize="small" />
                  </ListItemIcon>
                  Request Management
                </MenuItem>
              )}
              {/* <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/notifications'); }}>
                <ListItemIcon>
                  <NotificationsIcon fontSize="small" />
                </ListItemIcon>
                Notifications
              </MenuItem> */}
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Drawer>
      
      {/* Payment History Dialog */}
      <Dialog
        open={paymentHistoryOpen}
        onClose={() => setPaymentHistoryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Payment History
          </Typography>
          <IconButton
            onClick={() => setPaymentHistoryOpen(false)}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {loadingPaymentHistory ? (
            <Box sx={{ textAlign: 'center', py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Loading payment history...
              </Typography>
            </Box>
          ) : paymentHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <HistoryIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No payment history found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your payment history will appear here after making service requests.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              {paymentHistory.map((record) => (
                <PaymentHistoryCard key={record.id} record={record} />
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Profile Update Dialog */}
      <UserProfileUpdateDialog
        open={profileUpdateOpen}
        onClose={handleProfileUpdateClose}
        onProfileUpdated={(updatedUser) => {
          // The AuthContext will handle the update automatically
          // Force a re-render by updating the user state
          console.log('Profile updated:', updatedUser);
        }}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={handleChangePasswordClose}
      />
    </>
  );
};

export default Navbar;