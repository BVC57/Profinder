import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from '../api/axios';

const EditAdminDialog = ({ open, onClose, admin, onAdminUpdated }) => {
  const [formData, setFormData] = useState({
    profession: admin?.profession || '',
    experience: admin?.experience || '',
    city: admin?.city || '',
    pincode: admin?.pincode || '',
    mobile: admin?.mobile || admin?.phone || '',
    email: admin?.email || '',
    status: admin?.status || 'verified'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      const response = await axios.put(`/api/admin/profile/${admin._id}`, formData);
      
      onClose();
      
      if (onAdminUpdated) {
        onAdminUpdated(response.data.profile);
      }
      
    } catch (err) {
      console.error('Error updating admin:', err);
      setError(err.response?.data?.message || 'Failed to update admin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setFormData({
      profession: admin?.profession || '',
      experience: admin?.experience || '',
      city: admin?.city || '',
      pincode: admin?.pincode || '',
      mobile: admin?.mobile || admin?.phone || '',
      email: admin?.email || '',
      status: admin?.status || 'verified'
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Admin Profile</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Profession"
              value={formData.profession}
              onChange={(e) => handleInputChange('profession', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Experience (years)"
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              fullWidth
              required
              type="number"
            />
            
            <TextField
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Pincode"
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              fullWidth
              required
            />
            
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              required
              type="email"
            />
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="verified">Verified</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Update Profile'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditAdminDialog; 