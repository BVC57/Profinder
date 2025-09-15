import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';

const UserProfileUpdateDialog = ({ open, onClose, onProfileUpdated }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    pincode: '',
    mobile: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && open) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        city: user.city || '',
        pincode: user.pincode || '',
        mobile: user.mobile || ''
      });
      setProfilePhoto(null);
      setProfilePreview(null);
      setError('');
      setSuccess('');
    }
  }, [user, open]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  const getProfilePhotoUrl = () => {
    // Always show the selected photo if present
    if (profilePreview) {
      return profilePreview;
    }
    if (profilePhoto) {
      return URL.createObjectURL(profilePhoto);
    }
    if (user?.profilePhoto) {
      return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${user.profilePhoto}`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const formDataToSend = new FormData();
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      // Add profile photo if selected
      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const response = await axios.put('/api/users/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Profile updated successfully!');
      // Update user context
      if (updateUser) {
        updateUser(response.data.user);
      }
      // Notify parent component
      if (onProfileUpdated) {
        onProfileUpdated(response.data.user);
      }
      // Clear preview and photo after update
      setProfilePhoto(null);
      setProfilePreview(null);
      // Close dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      city: user?.city || '',
      pincode: user?.pincode || '',
      mobile: user?.mobile || ''
    });
    setProfilePhoto(null);
    setProfilePreview(null);
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={false}
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden',
          maxHeight: { xs: '100vh', sm: '90vh' },
          width: { xs: '100%', sm: 'auto' },
          margin: { xs: 0, sm: 'auto' },
          '& .MuiDialogContent-root': {
            padding: { xs: '12px', sm: '24px' }
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1.5, sm: 3 },
        py: { xs: 1, sm: 2 }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <EditIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Update Profile
          </Typography>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'white', p: { xs: 0.5, sm: 1 } }}>
          <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1.5rem' } }} />
        </IconButton>
      </DialogTitle>
     

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 2, px: { xs: 1.5, sm: 3 }, pb: { xs: 1, sm: 2 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
              {success}
            </Alert>
          )}

          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            {/* Profile Photo Section */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'center' }, 
                gap: { xs: 1.5, sm: 3 }, 
                mb: { xs: 2, sm: 3 } 
              }}>
                <Avatar
                  src={getProfilePhotoUrl()}
                  sx={{ 
                    width: { xs: 60, sm: 100 }, 
                    height: { xs: 60, sm: 100 },
                    fontSize: { xs: '1.5rem', sm: '2.5rem' },
                    fontWeight: 'bold',
                    border: '3px solid #e0e0e0'
                  }}
                >
                  {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                  <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                    Profile Photo
                  </Typography>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-photo-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="profile-photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
                      sx={{ 
                        mr: 1,
                        fontSize: { xs: '0.75rem', sm: '1rem' },
                        py: { xs: 0.25, sm: 1 },
                        px: { xs: 1, sm: 2 },
                        minHeight: { xs: '32px', sm: '40px' }
                      }}
                    >
                      {profilePhoto ? profilePhoto.name : 'Upload Photo'}
                    </Button>
                  </label>
                  {profilePhoto && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      Selected: {profilePhoto.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                Personal Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                error={!formData.name}
                helperText={!formData.name ? 'Name is required' : ''}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                    height: { xs: '40px', sm: '56px' }
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                error={!formData.email}
                helperText={!formData.email ? 'Email is required' : ''}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                    height: { xs: '40px', sm: '56px' }
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  },
                  '& .MuiFormHelperText-root': {
                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                  }
                }}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', mt: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
                Contact Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="10-digit mobile number"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                    height: { xs: '40px', sm: '56px' }
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter your city"
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                    height: { xs: '40px', sm: '56px' }
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                placeholder="6-digit pincode"
                inputProps={{ maxLength: 6 }}
                size="small"
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '14px', sm: '16px' },
                    height: { xs: '40px', sm: '56px' }
                  },
                  '& .MuiFormLabel-root': {
                    fontSize: { xs: '0.75rem', sm: '1rem' }
                  }
                }}
              />
            </Grid>

            {/* Current Role Display */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small" sx={{
                '& .MuiInputBase-root': {
                  fontSize: { xs: '14px', sm: '16px' },
                  height: { xs: '40px', sm: '56px' }
                },
                '& .MuiFormLabel-root': {
                  fontSize: { xs: '0.75rem', sm: '1rem' }
                }
              }}>
                <InputLabel>Current Role</InputLabel>
                <Select
                  value={user?.role || 'user'}
                  label="Current Role"
                  disabled
                >
                  <MenuItem value="user" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>User</MenuItem>
                  <MenuItem value="admin" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Admin</MenuItem>
                  <MenuItem value="superadmin" sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}>Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Verification Status */}
            {user?.verified && (
              <Grid item xs={12}>
                <Alert severity="success" sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '1rem' } }}>
                  ✅ Your account is verified
                </Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: { xs: 1.5, sm: 3 }, pt: { xs: 0.5, sm: 1 }, gap: 1 }}>
          <Button 
            onClick={handleClose} 
            disabled={loading}
            variant="outlined"
            size="small"
            sx={{ 
              minWidth: { xs: '60px', sm: '100px' },
              fontSize: { xs: '0.75rem', sm: '1rem' },
              py: { xs: 0.5, sm: 1 },
              px: { xs: 1, sm: 2 }
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading || !formData.name || !formData.email}
            startIcon={loading ? <CircularProgress size={16} /> : <EditIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
            size="small"
            sx={{ 
              minWidth: { xs: '100px', sm: '140px' },
              fontSize: { xs: '0.75rem', sm: '1rem' },
              py: { xs: 0.5, sm: 1 },
              px: { xs: 1.5, sm: 2 }
            }}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserProfileUpdateDialog; 