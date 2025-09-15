import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box,
  Alert,
  Link
} from '@mui/material';
import { LockReset as ResetPasswordIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axios';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setMessage({ type: 'error', text: 'Invalid reset link. Please request a new password reset.' });
    }
  }, [token]);

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      await axios.post('/api/auth/reset-password', { 
        token, 
        newPassword 
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset successfully! You can now login with your new password.' 
      });
      
      // Clear form
      setNewPassword('');
      setConfirmPassword('');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.message || 'Failed to reset password. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!tokenValid) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <ResetPasswordIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" component="h1" gutterBottom>
              Invalid Reset Link
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The password reset link is invalid or has expired.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/forgot-password')}
            >
              Request New Reset Link
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <ResetPasswordIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Reset Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your new password below
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <TextField 
          fullWidth 
          label="New Password" 
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          margin="normal" 
          required
          disabled={loading}
        />

        <TextField 
          fullWidth 
          label="Confirm New Password" 
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          margin="normal" 
          required
          disabled={loading}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth 
          size="large"
          onClick={handleSubmit}
          disabled={loading || !newPassword || !confirmPassword}
          sx={{ mt: 3, py: 1.5 }}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Link 
            component="button"
            variant="body2"
            onClick={() => navigate('/login')}
            sx={{ textDecoration: 'none' }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword; 