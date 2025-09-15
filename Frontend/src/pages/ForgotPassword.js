import React, { useState } from 'react';
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
import { LockReset as ForgotPasswordIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !email.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: '', text: '' });
      
      console.log('Sending forgot password request for email:', email);
      const response = await axios.post('/api/auth/forgot-password', { email });
      console.log('Forgot password response:', response.data);
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset instructions have been sent to your email address. Please check your inbox and spam folder.' 
      });
      setEmail('');
      
    } catch (err) {
      console.error('Forgot password error:', err);
      let errorMessage = 'Failed to send reset email. Please try again.';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        // Network error
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <ForgotPasswordIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Enter your email address and we'll send you instructions to reset your password
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.type} sx={{ mb: 3 }}>
            {message.text}
          </Alert>
        )}

        <TextField 
          fullWidth 
          label="Email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          disabled={loading || !email}
          sx={{ mt: 3, py: 1.5 }}
        >
          {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword; 