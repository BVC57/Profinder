// 📁 client/src/pages/SuperAdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button, 
  Container, 
  CardActions, 
  Alert, 
  Box, 
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fab
} from '@mui/material';
import {
  Visibility, 
  Verified, 
  Close, 
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  Cancel,
  Assignment as RequestIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  TrendingUp,
  Payment,
  Settings as SettingsIcon,
  ContactSupport as ContactIcon
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from '../../api/axios';
import SuperAdminDashboard from './SuperAdminDashboard';
import RequestManagement from '../RequestManagement';
import { useNotifications } from '../../hooks/useNotifications';
import { useSidebar } from '../../contexts/SidebarContext';
import ActivityDashboard from './ActivityDashboard';
import PendingAdminForVerificationRequest from './PendingAdminForVerificationRequest';
import VerifiedAdminList from '../VerifiedAdminList';
import PaymentPage from './Payment';
import Settings from '../Settings';
import ContactSubmissionsPanel from './ContactSubmissionsPanel';

const SuperAdminPanel = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [adminToReject, setAdminToReject] = useState(null);
  const location = useLocation();
  const { fetchNotifications } = useNotifications();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle activeSection from navigation state
  useEffect(() => {
    if (location.state?.activeSection !== undefined) {
      setActiveSection(location.state.activeSection);
    }
  }, [location.state]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching pending admins...');
      const res = await axios.get('/api/superadmin/pending');
      console.log('Pending admins response:', res.data);
      setPendingAdmins(res.data);
    } catch (err) {
      console.error('Error fetching pending admins:', err);
      setError(err.response?.data?.message || 'Failed to fetch pending admins');
    } finally {
      setLoading(false);
    }
  };

  const verifyAdmin = async (id) => {
    try {
      await axios.post(`/api/superadmin/verify/${id}`);
      fetchAdmins(); // Refresh the list
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error('Error verifying admin:', err);
      setError(err.response?.data?.message || 'Failed to verify admin');
    }
  };

  const rejectAdmin = async (id) => {
    try {
      await axios.post(`/api/superadmin/reject/${id}`);
      fetchAdmins(); // Refresh the list
      fetchNotifications(); // Refresh notifications
      setRejectDialogOpen(false);
      setAdminToReject(null);
    } catch (err) {
      console.error('Error rejecting admin:', err);
      setError(err.response?.data?.message || 'Failed to reject admin');
    }
  };

  const handleRejectConfirm = () => {
    if (adminToReject) {
      rejectAdmin(adminToReject);
    }
  };

  const handleRejectCancel = () => {
    setRejectDialogOpen(false);
    setAdminToReject(null);
  };

  const handleViewImage = (imagePath, documentType) => {
    console.log('Opening image:', { imagePath, documentType });
    const fullImageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`;
    console.log('Full image URL:', fullImageUrl);
    setSelectedImage({ path: imagePath, type: documentType });
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };



  useEffect(() => {
    if (activeSection === 'pending-admins') {
      fetchAdmins();
    }
  }, [activeSection]);

  const sidebarItems = [
    { id: 'dashboard', text: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'pending-admins', text: 'Pending Admins', icon: <AdminIcon /> },
    { id: 'requests', text: 'All Requests', icon: <RequestIcon /> },
    { id: 'activity-log', text: 'Activity Log', icon: <TrendingUp /> },
    { id: 'verified-admins', text: 'Verified Admins', icon: <Verified /> },
    { id: 'admin-plan-purchases', text: 'Admin Plan Purchases', icon: <Payment /> },
    { id: 'contact-submissions', text: 'Contact Messages', icon: <ContactIcon /> },
    { id: 'allpayment', text: 'All Payments', icon: <Payment /> },
    { id: 'settings', text: 'Settings', icon: <SettingsIcon /> }
  ];

  const PendingAdminsList = () => {
    if (loading) {
      return (
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Loading pending admins...</Typography>
        </Container>
      );
    }

    return (
      <Container sx={{ mt: 4 }}>
      
        <Typography variant="h4" gutterBottom>Pending Admins for Verification</Typography>
      
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {pendingAdmins.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No pending admins found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Profession</strong></TableCell>
                  <TableCell><strong>Experience</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Identity Documents</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingAdmins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <Typography variant="body1">
                        {admin.userId?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.profession}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.experience}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.city}, {admin.pincode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {admin.aadharCard && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Aadhar Card" size="small" color="primary" />
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewImage(admin.aadharCard, 'Aadhar Card')}
                            >
                              View
                            </Button>
                          </Box>
                        )}
                        
                        {admin.voterId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Voter ID" size="small" color="secondary" />
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewImage(admin.voterId, 'Voter ID')}
                            >
                              View
                            </Button>
                          </Box>
                        )}
                        
                        {!admin.aadharCard && !admin.voterId && (
                          <Typography variant="body2" color="error">
                            No documents uploaded
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="success"
                          startIcon={<Verified />}
                          onClick={() => verifyAdmin(admin._id)}
                          size="small"
                        >
                          Verify
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => {
                            setRejectDialogOpen(true);
                            setAdminToReject(admin._id);
                          }}
                          size="small"
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Image View Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={handleCloseImageDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {selectedImage?.type} Document
              </Typography>
              <IconButton onClick={handleCloseImageDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${selectedImage.path}`}
                  alt={selectedImage.type}
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="error" 
                  sx={{ display: 'none', textAlign: 'center', mt: 2 }}
                >
                  Failed to load image. Please check the file path.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };

  const AdminPlanPaymentsTable = React.lazy(() => import('./AdminPlanPaymentsTable'));
  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <SuperAdminDashboard />;
      case 'pending-admins':
        return <PendingAdminForVerificationRequest />;
      case 'requests':
        return <RequestManagement />;
      case 'activity-log':
        return <ActivityDashboard />;
      case 'verified-admins':
        return <VerifiedAdminList/>;
      case 'admin-plan-purchases':
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <AdminPlanPaymentsTable />
          </React.Suspense>
        );
      case 'contact-submissions':
        return <ContactSubmissionsPanel />;
      case 'allpayment':
        return <PaymentPage />;
      case 'settings':
        return (
          <Settings
            open={true}
            onClose={() => setActiveSection("dashboard")}
          />
        );
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '83.6vh', position: 'relative' }}>
      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={sidebarOpen}
        onClose={isMobile ? toggleSidebar : undefined}
        sx={{
          width: sidebarOpen ? 240 : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? 240 : 60,
            overflowX: 'hidden',
            transition: 'width 0.2s ease-in-out',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderRight: 'none',
            boxShadow: theme.shadows[8],
            [theme.breakpoints.down('md')]: {
              width: 240,
            }
          },
        }}
      >
        <Box sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'rgba(255,255,255,0.2)',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ 
            color: 'white',
            fontWeight: 'bold',
            visibility: sidebarOpen ? 'visible' : 'hidden',
            transition: 'visibility 0.2s ease-in-out',
            flexGrow: 1,
            textAlign: 'center',
            minWidth: 0,
            width: '100%'
          }}>
            Super Admin
          </Typography>
          {!isMobile && (
            <IconButton
              onClick={toggleSidebar}
              sx={{
                color: 'white',
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          )}
        </Box>
        <List sx={{ mt: 2, px: 1 }}>
          {sidebarItems.map((item) => (
            <ListItem
              button
              key={item.id}
              onClick={() => {
                handleSectionChange(item.id);
                if (isMobile) {
                  toggleSidebar();
                }
              }}
              sx={{
                backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                mb: 1,
                borderRadius: 2,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: activeSection === item.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)',
                  transform: 'translateX(4px)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: 'white', 
                minWidth: 40,
                opacity: activeSection === item.id ? 1 : 0.8
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  opacity: sidebarOpen ? 1 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                  '& .MuiListItemText-primary': {
                    fontWeight: activeSection === item.id ? 'bold' : 'normal'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
      }}>
        {/* Content Area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: { xs: 2, md: 3 },
          backgroundColor: theme.palette.background.paper,
          borderRadius: { xs: 0, md: 2 },
          m: { xs: 0, md: 2 },
          boxShadow: theme.shadows[1]
        }}>
          {/* Section Header */}
          <Box sx={{ 
            mb: 3, 
            pb: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{
              width: 4,
              height: 24,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2
            }} />
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold',
              color: theme.palette.primary.main
            }}>
              {sidebarItems.find(item => item.id === activeSection)?.text || 'Dashboard'}
            </Typography>
          </Box>
          
          {renderContent()}
        </Box>
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            boxShadow: theme.shadows[8],
            '&:hover': {
              boxShadow: theme.shadows[12],
            }
          }}
        >
          {sidebarOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </Fab>
      )}

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialogOpen}
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6">Confirm Rejection</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to reject this admin request? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRejectCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRejectConfirm} color="error" variant="contained">
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuperAdminPanel;
