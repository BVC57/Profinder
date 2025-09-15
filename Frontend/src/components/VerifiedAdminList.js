import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
  InputAdornment,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  useTheme,
  useMediaQuery,
  Chip,
  Divider
} from '@mui/material';
import { 
  Search, 
  LocationOn, 
  Work, 
  Edit, 
  Delete, 
  Visibility,
  Phone,
  Email,
  Person,
  Business,
  Star
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import AdminProfileDialog from './AdminProfileDialog';
import EditAdminDialog from './EditAdminDialog';
import { getProfilePhotoUrl } from '../utils/apiUtils';

const VerifiedAdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  
  // Available options for filters
  const [professions, setProfessions] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [adminRatings, setAdminRatings] = useState({});
  
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  console.log(admins,"admins")
  console.log('API URL being used:', process.env.REACT_APP_API_URL || 'http://192.168.31.3:5000');
  
  // Fetch all verified admins
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/verified');
      console.log('Raw admin data:', response.data);
      
      const adminsData = response.data.map(admin => {
        const adminData = {
          ...admin,
          name: admin.name || admin.userId?.name || 'Unknown',
          email: admin.email || admin.userId?.email || '',
          mobile: admin.mobile || admin.userId?.mobile || '',
          profession: admin.profession,
          city: admin.city,
          experience: admin.experience,
          pincode: admin.pincode,
          gender: admin.gender || admin.userId?.gender || '',
          profilePhoto: admin.profilePhoto || admin.userId?.profilePhoto || '',
        };
        console.log('Processed admin data:', adminData);
        return adminData;
      });
      
      setAdmins(adminsData);
      setFilteredAdmins(adminsData);
      await fetchFilterOptions();
      // Fetch ratings for all admins
      const ratings = {};
      await Promise.all(adminsData.map(async (admin) => {
        try {
          const res = await axios.get(`/api/user-requests/admin/${admin._id}/average-rating`);
          ratings[admin._id] = res.data;
        } catch (e) {
          ratings[admin._id] = { average: 0, count: 0 };
        }
      }));
      setAdminRatings(ratings);
    } catch (err) {
      setError('Failed to load verified professionals');
      console.error('Error fetching admins:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch filter options (professions and cities)
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get('/api/admin/filter-options');
      setProfessions(response.data.professions);
      setCities(response.data.cities);
    } catch (err) {
      console.error('Error fetching filter options:', err);
      // Fallback: extract from current admins data
      const uniqueProfessions = [...new Set(admins.map(admin => admin.profession))];
      const uniqueCities = [...new Set(admins.map(admin => admin.city))];
      setProfessions(uniqueProfessions);
      setCities(uniqueCities);
    }
  };

  // Enhanced search with backend support
  const performSearch = async () => {
    try {
      setSearchLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('searchTerm', searchTerm);
      if (selectedProfession) params.append('profession', selectedProfession);
      if (selectedCity) params.append('city', selectedCity);
      
      const response = await axios.get(`/api/admin/search?${params.toString()}`);
      console.log('Search response:', response.data);
      
      const adminsData = response.data.map(admin => {
        const adminData = {
          ...admin,
          name: admin.name || admin.userId?.name || 'Unknown',
          email: admin.email || admin.userId?.email || '',
          profession: admin.profession,
          city: admin.city,
          experience: admin.experience,
          pincode: admin.pincode,
          gender: admin.gender || admin.userId?.gender || '',
          profilePhoto: admin.profilePhoto || admin.userId?.profilePhoto || '',
        };
        console.log('Processed search admin data:', adminData);
        return adminData;
      });
      
      setFilteredAdmins(adminsData);
    } catch (err) {
      console.error('Search error:', err);
      // Fallback to client-side filtering
      applyFilters();
    } finally {
      setSearchLoading(false);
    }
  };

  // Apply filters and search
  const applyFilters = () => {
    let filtered = admins;
    if (searchTerm) {
      filtered = filtered.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedProfession) {
      filtered = filtered.filter(admin => admin.profession === selectedProfession);
    }
    if (selectedCity) {
      filtered = filtered.filter(admin => admin.city === selectedCity);
    }
    setFilteredAdmins(filtered);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProfession('');
    setSelectedCity('');
    console.log('clearFilters called. admins:', admins);
  };

  // Handle admin row click
  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    setDialogOpen(true);
  };

  // Handle edit admin
  const handleEditAdmin = (admin) => {
    // Open edit dialog instead of navigating
    setSelectedAdmin(admin);
    setEditDialogOpen(true);
    setError(''); // Clear any previous errors
  };

  // Handle delete admin
  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
    setError(''); // Clear any previous errors
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    
    try {
      setDeleteLoading(true);
      // Use the correct API endpoint for deleting admin profiles
      await axios.delete(`/api/admin/profile/${adminToDelete._id}`);
      
      // Remove from lists
      setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== adminToDelete._id));
      setFilteredAdmins(prevFiltered => prevFiltered.filter(admin => admin._id !== adminToDelete._id));
      
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
      setError(''); // Clear any previous errors
      setSuccessMessage(`${adminToDelete.name} has been deleted successfully`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error deleting admin:', err);
      setError(err.response?.data?.message || 'Failed to delete admin');
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    // eslint-disable-next-line
  }, []);

  // Debounced search effect
  useEffect(() => {
    console.log('Effect triggered. searchTerm:', searchTerm, 'selectedProfession:', selectedProfession, 'selectedCity:', selectedCity);
    console.log('Current admins:', admins);
    if (searchTerm || selectedProfession || selectedCity) {
      performSearch();
    } else {
      console.log('Setting filteredAdmins to admins:', admins);
      setFilteredAdmins(admins);
    }
  }, [searchTerm, selectedProfession, selectedCity, admins]);

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading verified professionals...
        </Typography>
      </Container>
    );
  }

  // Mobile Card View
  const renderMobileCard = (admin) => (
    <Card key={admin._id} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
      <CardContent sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          <Avatar
            src={getProfilePhotoUrl(admin.profilePhoto)}
            alt={admin.name}
            sx={{ width: 50, height: 50, mr: 1.5, flexShrink: 0 }}
            onError={(e) => {
              console.log('Mobile: Profile photo failed to load for:', admin.name, 'Photo:', admin.profilePhoto, 'URL:', getProfilePhotoUrl(admin.profilePhoto));
              e.target.style.display = 'none';
            }}
          >
            {admin.name?.charAt(0)?.toUpperCase() || 'P'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body1" fontWeight="bold" sx={{ fontSize: '0.9rem', mb: 0.5 }}>
              {admin.name}
            </Typography>
            <Chip 
              label={admin.profession} 
              size="small" 
              color="primary" 
              sx={{ fontSize: '0.7rem', height: 20 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title="View Profile">
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleAdminClick(admin)}
                sx={{ width: 28, height: 28 }}
              >
                <Visibility sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {isAuthenticated && user?.role === 'superadmin' && (
              <>
                <Tooltip title="Edit">
                  <IconButton 
                    size="small" 
                    color="info"
                    onClick={() => handleEditAdmin(admin)}
                    sx={{ width: 28, height: 28 }}
                  >
                    <Edit sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDeleteClick(admin)}
                    sx={{ width: 28, height: 28 }}
                  >
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ fontSize: 14, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {admin.gender ? admin.gender.charAt(0).toUpperCase() + admin.gender.slice(1) : '-'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Business sx={{ fontSize: 14, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {admin.experience} yrs experience
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 14, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {admin.city}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Star sx={{ fontSize: 14, mr: 0.5, color: 'warning.main', flexShrink: 0 }} />
          <Rating value={adminRatings[admin._id]?.average || 0} precision={0.1} readOnly size="small" />
          <Typography variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
            {adminRatings[admin._id]?.average ? adminRatings[admin._id].average.toFixed(1) : '-'}
            {adminRatings[admin._id]?.count ? ` (${adminRatings[admin._id].count})` : ''}
          </Typography>
        </Box>

        <Divider sx={{ my: 0.5 }} />
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Email sx={{ fontSize: 14, mr: 1, color: 'text.secondary', flexShrink: 0, mt: 0.1 }} />
            <Typography variant="caption" sx={{ fontSize: '0.7rem', wordBreak: 'break-all' }}>
              {admin.email}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Phone sx={{ fontSize: 14, mr: 1, color: 'text.secondary', flexShrink: 0 }} />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {admin.mobile}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        Verified Professionals
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        Discover trusted and verified professionals in your area
      </Typography> */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}
      
      {/* Responsive Search & Filter */}
      <Paper sx={{ mb: 3, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              placeholder="Name, profession, or city"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>Profession</InputLabel>
              <Select
                value={selectedProfession}
                label="Profession"
                onChange={e => setSelectedProfession(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Professions</MenuItem>
                {professions.map((profession) => (
                  <MenuItem key={profession} value={profession}>
                    {profession}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={selectedCity}
                label="City"
                onChange={e => setSelectedCity(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Cities</MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={performSearch}
                startIcon={<Search />}
                size="small"
                sx={{ minWidth: 100 }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={clearFilters}
                size="small"
                sx={{ minWidth: 120 }}
              >
                Clear Filters
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', alignSelf: 'center' }}>
                {filteredAdmins.length} found
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Mobile Card View */}
      {isMobile ? (
        <Box>
          {searchLoading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Searching professionals...
              </Typography>
            </Box>
          ) : filteredAdmins.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No professionals found matching your criteria
              </Typography>
            </Paper>
          ) : (
            filteredAdmins.map(renderMobileCard)
          )}
        </Box>
      ) : (
        /* Desktop Table View */
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Photo</b></TableCell>
                <TableCell><b>Name</b></TableCell>
                <TableCell><b>Gender</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Mobile</b></TableCell>
                <TableCell><b>Profession</b></TableCell>
                <TableCell><b>City</b></TableCell>
                <TableCell><b>Experience</b></TableCell>
                <TableCell><b>Rating</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {searchLoading ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    <CircularProgress size={32} /> Searching professionals...
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center">
                    No professionals found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin._id} hover>
                    <TableCell>
                      <Avatar
                        src={getProfilePhotoUrl(admin.profilePhoto)}
                        alt={admin.name}
                        sx={{ width: 60, height: 60 }}
                        onError={(e) => {
                          console.log('Desktop: Profile photo failed to load for:', admin.name, 'Photo:', admin.profilePhoto, 'URL:', getProfilePhotoUrl(admin.profilePhoto));
                          e.target.style.display = 'none';
                        }}
                      >
                        {admin.name?.charAt(0)?.toUpperCase() || 'P'}
                      </Avatar>
                    </TableCell>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.gender ? admin.gender.charAt(0).toUpperCase() + admin.gender.slice(1) : '-'}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.mobile}</TableCell>
                    <TableCell>{admin.profession}</TableCell>
                    <TableCell>{admin.city}</TableCell>
                    <TableCell>{admin.experience} yrs</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating value={adminRatings[admin._id]?.average || 0} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {adminRatings[admin._id]?.average ? adminRatings[admin._id].average.toFixed(1) : '-'}
                          {adminRatings[admin._id]?.count ? ` (${adminRatings[admin._id].count})` : ''}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Profile">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleAdminClick(admin)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        {isAuthenticated && user?.role === 'superadmin' && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleEditAdmin(admin)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteClick(admin)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Admin Profile Dialog */}
      <AdminProfileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        admin={selectedAdmin}
        loading={false}
        onAdminUpdated={(updatedAdmin) => {
          // Refresh the admin list when an admin is updated
          fetchAdmins();
        }}
        onAdminDeleted={(deletedAdminId) => {
          // Remove the deleted admin from the list
          setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== deletedAdminId));
          setFilteredAdmins(prevFiltered => prevFiltered.filter(admin => admin._id !== deletedAdminId));
        }}
      />

      {/* Edit Admin Dialog */}
      <EditAdminDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        admin={selectedAdmin}
        onAdminUpdated={(updatedAdmin) => {
          // Refresh the admin list when an admin is updated
          fetchAdmins();
          setEditDialogOpen(false);
          setSuccessMessage(`${updatedAdmin.name || 'Admin'} profile updated successfully`);
          setError(''); // Clear any previous errors
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => {
        setDeleteDialogOpen(false);
        setError(''); // Clear errors when dialog is closed
      }}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {adminToDelete?.name}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default VerifiedAdminList; 