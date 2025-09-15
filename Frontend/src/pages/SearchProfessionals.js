import React, { useState } from 'react';
import {
  Container,
  TextField,
  Grid,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import axios from '../api/axios';
import VerifiedAdminCard from '../components/VerifiedAdminCard';

const SearchProfessionals = () => {
  const [form, setForm] = useState({ city: '', profession: '' });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    if (!form.city && !form.profession) {
      setError('Please enter at least one search criteria (city or profession)');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const res = await axios.get('/api/admin/search', {
        params: {
          city: form.city,
          profession: form.profession
        }
      });
      setResults(res.data);
      setSearched(true);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setError(error.response?.data?.message || 'Error searching for professionals');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setForm({ city: '', profession: '' });
    setResults([]);
    setSearched(false);
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Find Verified Professionals
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter city name"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Profession"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter profession"
          />
        </Grid>
        <Grid item xs={12}>
          <Box textAlign="center" sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>

      {searched && !loading && (
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Search Results ({results.length} professionals found)
          </Typography>
          {form.city && (
            <Chip label={`City: ${form.city}`} color="primary" sx={{ mr: 1, mb: 1 }} />
          )}
          {form.profession && (
            <Chip label={`Profession: ${form.profession}`} color="primary" sx={{ mr: 1, mb: 1 }} />
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {results.length > 0 ? (
          results.map((admin) => (
            <Grid item xs={12} sm={6} md={4} key={admin._id}>
              <VerifiedAdminCard admin={admin} />
            </Grid>
          ))
        ) : (
          searched && !loading && (
            <Grid item xs={12}>
              <Typography variant="body1" textAlign="center" color="text.secondary">
                No professionals found matching your criteria.
              </Typography>
            </Grid>
          )
        )}
      </Grid>
    </Container>
  );
};

export default SearchProfessionals;
