import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';

const SidebarDrawer = ({
  isAuthenticated,
  userName,
  menuItems,
  isActive,
  handleNavigation,
  handleProfileUpdate,
  handleChangePasswordOpen,
  handleLogout
}) => (
  <Box sx={{ width: 250 }}>
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
      <Typography variant="h6" color="primary">
        ProFinder
      </Typography>
      {isAuthenticated && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Welcome back, {userName}!
        </Typography>
      )}
    </Box>
    <List>
      {menuItems.map((item) => (
        <ListItem 
          button 
          key={item.text}
          onClick={() => handleNavigation(item.path)}
          sx={{
            backgroundColor: isActive(item.path) ? 'primary.light' : 'transparent',
            color: isActive(item.path) ? 'primary.contrastText' : 'inherit',
            '&:hover': {
              backgroundColor: isActive(item.path) ? 'primary.main' : 'action.hover',
            }
          }}
        >
          <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.contrastText' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      {isAuthenticated && (
        <>
          <ListItem 
            button 
            onClick={handleProfileUpdate}
            sx={{
              backgroundColor: isActive('/admin-profile') ? 'primary.light' : 'transparent',
              color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: isActive('/admin-profile') ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Update Profile" />
          </ListItem>
          <ListItem 
            button 
            onClick={handleChangePasswordOpen}
            sx={{
              backgroundColor: isActive('/admin-profile') ? 'primary.light' : 'transparent',
              color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: isActive('/admin-profile') ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit' }}>
              <LockIcon />
            </ListItemIcon>
            <ListItemText primary="Change Password" />
          </ListItem>
          <ListItem 
            button 
            onClick={() => { handleNavigation('/admin-profile'); }}
            sx={{
              backgroundColor: isActive('/admin-profile') ? 'primary.light' : 'transparent',
              color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                backgroundColor: isActive('/admin-profile') ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive('/admin-profile') ? 'primary.contrastText' : 'inherit' }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="View Profile" />
          </ListItem>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              color: 'error.main',
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </>
      )}
    </List>
  </Box>
);
export default SidebarDrawer;
