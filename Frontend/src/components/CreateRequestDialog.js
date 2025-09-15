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
import { Close as CloseIcon } from '@mui/icons-material';
import axios from '../api/axios';

const CreateRequestDialog = ({ open, onClose, admin, onRequestCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedDays: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.estimatedDays) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await axios.post('/api/user-requests/create', {
        adminId: admin._id,
        title: formData.title,
        description: formData.description,
        estimatedDays: parseInt(formData.estimatedDays)
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        estimatedDays: ''
      });

      onRequestCreated(response.data.request);
      onClose();
    } catch (error) {
      console.error('Error creating request:', error);
      setError(error.response?.data?.message || 'Error creating request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      estimatedDays: ''
    });
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Request Services from {admin?.name}
        </Typography>
        <Button
          onClick={handleClose}
          sx={{ color: 'white', minWidth: 'auto' }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Request Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            placeholder="e.g., Legal Consultation, Medical Advice"
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Please describe your request in detail..."
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Estimated Timeline (Days)</InputLabel>
            <Select
              name="estimatedDays"
              value={formData.estimatedDays}
              onChange={handleChange}
              label="Estimated Timeline (Days)"
              required
            >
              <MenuItem value={1}>1 Day</MenuItem>
              <MenuItem value={2}>2 Days</MenuItem>
              <MenuItem value={3}>3 Days</MenuItem>
              <MenuItem value={5}>5 Days</MenuItem>
              <MenuItem value={7}>1 Week</MenuItem>
              <MenuItem value={14}>2 Weeks</MenuItem>
              <MenuItem value={30}>1 Month</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Professional Information:</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Profession: {admin?.profession}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Experience: {admin?.experience} years
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Location: {admin?.city}, {admin?.pincode}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          variant="outlined" 
          onClick={handleClose}
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Submit Request'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRequestDialog; 