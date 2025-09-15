import React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

// Import components
import Navbar from './components/Navbar';
import { NotificationProvider } from './hooks/useNotifications';
import { SidebarProvider } from './contexts/SidebarContext';
import { AuthProvider } from './contexts/AuthContext';
// Removed PaymentHistoryProvider import
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SearchProfessionals from './pages/SearchProfessionals';
import AdminDashboard from './pages/AdminDashboard';
import AdminProfile from './pages/AdminProfile';
import SuperAdminPanel from './components/SuperAdmin/SuperAdminPanel';
import VerifiedAdmins from './pages/VerifiedAdmins';
import UserDataDashboardPage from './pages/UserDataDashboardPage';
import RequestManagementPage from './pages/RequestManagementPage';
import NotFound from './pages/NotFound';
import SearchAdminWithMap from './pages/SearchAdminWithMap';
import AboutUsPage from './pages/AboutUsPage';
import AdminForm from './components/AdminForm';
import NotificationsPage from './pages/NotificationsPage';
import ContactUsPage from './pages/ContactUsPage';
import ComprehensivePaymentHandler from './components/ComprehensivePaymentHandler';
import AdminPlanPaymentsPage from './pages/AdminPlanPaymentsPage';

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer />
      <AuthProvider>
          <NotificationProvider>
            <SidebarProvider>
              <div className="App">
              <ComprehensivePaymentHandler/>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', minHeight: 0 }}>
                  <Navbar />
                  <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                    <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password/:token" element={<ResetPassword />} />
                  <Route path="/search" element={<SearchProfessionals />} />
                  
                  <Route path="/admin-dashboard" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin-profile" element={<AdminProfile />} />
                  <Route path="/super-admin" element={
                    <ProtectedRoute requiredRole="superadmin">
                      <SuperAdminPanel />
                    </ProtectedRoute>
                  } />
                <Route path="/admin-plan-payments" element={<AdminPlanPaymentsPage />} />
                  {/* <Route path="/verified-admins" element={<VerifiedAdmins />} /> */}
                  <Route path="/user-data-dashboard" element={<UserDataDashboardPage />} />
                  <Route path="/requests" element={<RequestManagementPage />} />
                  <Route path="/admin-form" element={<AdminForm />} />
                  <Route path="/search-admin-map" element={<SearchAdminWithMap />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/contact" element={<ContactUsPage />} />
                  <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Box>
                </Box>
              </div>
            </SidebarProvider>
          </NotificationProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

export default App;
