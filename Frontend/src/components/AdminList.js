import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Paper,
  useTheme,
  Chip,
  CircularProgress,
  Avatar,
  Divider,
  Rating,
  Stack,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { 
  Search as SearchIcon,
  VerifiedUser as VerifiedIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as SuperAdminIcon,
  Login as LoginIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import AdminProfileDialog from '../components/AdminProfileDialog';

const AdminList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [verifiedAdmins, setVerifiedAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [allProfessions, setAllProfessions] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [adminRatings, setAdminRatings] = useState({});
console.log(adminRatings,"admin ratings");
  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Find Professionals',
      description: 'Search and discover verified professionals in your area with detailed profiles and reviews.'
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Verified Profiles',
      description: 'All professionals are thoroughly verified to ensure quality and reliability.'
    },
    {
      icon: <AdminIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Admin Dashboard',
      description: 'Comprehensive admin tools to manage users, profiles, and platform operations.'
    },
    {
      icon: <SuperAdminIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Super Admin Panel',
      description: 'Advanced administrative controls for platform-wide management and oversight.'
    }
  ];

  // Fetch verified admins
  const fetchVerifiedAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/admin/verified');
      const admins = response.data.map(admin => ({
        ...admin,
        name: admin.userId?.name || 'Unknown',
        profession: admin.profession,
        city: admin.city,
        experience: admin.experience
      }));
      setVerifiedAdmins(admins);
      
      // Extract unique professions and locations for filters
      const professions = [...new Set(admins.map(admin => admin.profession).filter(Boolean))];
      const locations = [...new Set(admins.map(admin => admin.city).filter(Boolean))];
      setAllProfessions(professions);
      setAllLocations(locations);
      // Fetch ratings for all admins
      const ratings = {};
      await Promise.all(admins.map(async (admin) => {
        try {
          const res = await axios.get(`/api/user-requests/admin/${admin._id}/average-rating`);
          ratings[admin._id] = res.data;
        } catch (e) {
          ratings[admin._id] = { average: 0, count: 0 };
        }
      }));
      setAdminRatings(ratings);
    } catch (error) {
      console.error('Error fetching verified admins:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter admins based on search term and filters
  const filteredAdmins = verifiedAdmins.filter(admin => {
    const matchesSearch = searchTerm === '' || 
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = selectedProfession === '' || admin.profession === selectedProfession;
    const matchesLocation = selectedLocation === '' || admin.city === selectedLocation;
    
    return matchesSearch && matchesProfession && matchesLocation;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedProfession('');
    setSelectedLocation('');
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedProfession || selectedLocation;

  // Handle view profile button click
  const handleViewProfile = async (admin) => {
    try {
      setProfileLoading(true);
      setSelectedAdmin(admin);
      setProfileDialogOpen(true);
      
      // Fetch detailed admin profile
      const response = await axios.get(`/api/user/${admin._id}`);
      setSelectedAdmin(response.data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      setSelectedAdmin(admin); // Use basic info if detailed fetch fails
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
    setSelectedAdmin(null);
  };

  useEffect(() => {
    fetchVerifiedAdmins();
  }, []);

  return (
    <Box sx={{ backgroundColor: '#f5f5f5' }}>
      
      {/* <Paper 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome to ProFinder
              </Typography>
              <Typography variant="h5" paragraph sx={{ opacity: 0.9 }}>
                Connect with verified professionals and find the expertise you need
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate('/search')}
                  sx={{ 
                    mr: 2, 
                    backgroundColor: 'white', 
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'grey.100' }
                  }}
                >
                  Start Searching
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Join Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h1" sx={{ fontSize: '4rem', opacity: 0.1 }}>
                  PF
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper> */}

    
      {/* <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom sx={{ mb: 4 }}>
          Why Choose ProFinder?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={2} 
                sx={{ 
                  height: '100%', 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Container maxWidth="md" sx={{ mb: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h3" textAlign="center" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ py: 2 }}
              >
                Login to Your Account
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="large"
                onClick={() => navigate('/admin-dashboard')}
                sx={{ py: 2 }}
              >
                Admin Dashboard
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container> */}

      {/* Verified Professionals Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {/* <Box sx={{ textAlign: 'center', mb: isMobile ? 3 : 6 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"}
            component="h2" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: isMobile ? 1 : 2
            }}
          >
            Our Verified Professionals
          </Typography>
          <Typography 
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Discover trusted professionals in your area. {!isAuthenticated && 'Login to see full profiles and connect with them.'}
          </Typography>
        </Box> */}
        
        {/* Search and Filter Section */}
        <Paper sx={{ mb: 3, mt: 3, p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label={<span style={{ fontSize: isMobile ? 12 : 16 }}>Search...</span>}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </InputAdornment>
                  ),
                  style: { fontSize: isMobile ? 12 : 16 }
                }}
                inputProps={{ style: { fontSize: isMobile ? 12 : 16 } }}
                placeholder="Name, profession, or city"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel style={{ fontSize: isMobile ? 12 : 16 }}>Profession</InputLabel>
                <Select
                  value={selectedProfession}
                  label="Profession"
                  onChange={e => setSelectedProfession(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <WorkIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </InputAdornment>
                  }
                  sx={{ fontSize: isMobile ? 12 : 16 }}
                  MenuProps={{
                    PaperProps: {
                      style: { fontSize: isMobile ? 12 : 16 }
                    }
                  }}
                >
                  <MenuItem value="" style={{ fontSize: isMobile ? 12 : 16 }}>All Professions</MenuItem>
                  {allProfessions.map((profession) => (
                    <MenuItem key={profession} value={profession} style={{ fontSize: isMobile ? 12 : 16 }}>
                      {profession}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl size="small" fullWidth>
                <InputLabel style={{ fontSize: isMobile ? 12 : 16 }}>City</InputLabel>
                <Select
                  value={selectedLocation}
                  label="City"
                  onChange={e => setSelectedLocation(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <LocationIcon fontSize={isMobile ? 'small' : 'medium'} />
                    </InputAdornment>
                  }
                  sx={{ fontSize: isMobile ? 12 : 16 }}
                  MenuProps={{
                    PaperProps: {
                      style: { fontSize: isMobile ? 12 : 16 }
                    }
                  }}
                >
                  <MenuItem value="" style={{ fontSize: isMobile ? 12 : 16 }}>All Cities</MenuItem>
                  {allLocations.map((city) => (
                    <MenuItem key={city} value={city} style={{ fontSize: isMobile ? 12 : 16 }}>
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
                  startIcon={<SearchIcon fontSize={isMobile ? 'small' : 'medium'} />}
                  size="small"
                  sx={{ minWidth: 100, fontSize: isMobile ? 12 : 16 }}
                  onClick={() => {}} // No-op, since search is live
                >
                  <span style={{ fontSize: isMobile ? 12 : 16 }}>Search</span>
                </Button>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  size="small"
                  sx={{ minWidth: 120, fontSize: isMobile ? 12 : 16 }}
                >
                  <span style={{ fontSize: isMobile ? 12 : 16 }}>Clear Filters</span>
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', alignSelf: 'center', fontSize: isMobile ? 12 : 16 }}>
                  {filteredAdmins.length} found
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            <Grid
              container
              spacing={isMobile ? 2 : 4}
              sx={{ mb: isMobile ? 3 : 6, mx: 0 }}
              justifyContent="center"
              alignItems="stretch"
            >
              {filteredAdmins.map((admin, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  lg={4}
                  key={admin._id || index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'left',
                    alignItems: 'stretch',
                  }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%', 
                      width: '100%',
                      maxWidth: 400, // Optional: limit card width for better centering
                      margin: '0 auto', // Center card horizontally
                      transition: 'all 0.3s ease',
                      border: '1px solid',
                      borderColor: 'grey.200',
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': { 
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    {/* Header with gradient background */}
                    <Box 
                      sx={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        p: isMobile ? 2 : 3,
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      <Box sx={{ position: 'absolute', top: -20, right: -20, opacity: 0.1 }}>
                        <WorkIcon sx={{ fontSize: isMobile ? 60 : 100 }} />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 2 }}>
                        <Avatar 
                          src={admin.profilePhoto ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${admin.profilePhoto}` : undefined}
                          sx={{ 
                            width: isMobile ? 45 : 60, 
                            height: isMobile ? 45 : 60, 
                            mr: isMobile ? 1.5 : 2,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            fontSize: isMobile ? '1.2rem' : '1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {admin.name?.charAt(0)?.toUpperCase() || 'P'}
                        </Avatar>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>
                          <Typography 
                            variant={isMobile ? "body1" : "h6"} 
                            sx={{ 
                              fontWeight: 'bold', 
                              mb: 0.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              maxWidth: '100%'
                            }}
                          >
                            {admin.name}
                          </Typography>
                          <Chip 
                            label="✅ Verified Professional" 
                            size="small"
                            sx={{ 
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontSize: isMobile ? '0.6rem' : '0.7rem',
                              fontWeight: 'medium'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: isMobile ? 2 : 3 }}>
                      {/* Profession */}
                      <Typography 
                        variant={isMobile ? "body1" : "h6"}
                        sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          mb: isMobile ? 1 : 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <WorkIcon sx={{ mr: 1, fontSize: isMobile ? 16 : 20 }} />
                        {admin.profession}
                      </Typography>

                      <Divider sx={{ my: isMobile ? 1 : 2 }} />

                      {/* Details */}
                      <Stack spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 2 : 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationIcon sx={{ color: 'text.secondary', mr: isMobile ? 1 : 1.5, fontSize: isMobile ? 16 : 20 }} />
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            {admin.city}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimeIcon sx={{ color: 'text.secondary', mr: isMobile ? 1 : 1.5, fontSize: isMobile ? 16 : 20 }} />
                          <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                            {admin.experience} years of experience
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <StarIcon sx={{ color: 'warning.main', mr: isMobile ? 1 : 1.5, fontSize: isMobile ? 16 : 20 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Rating
                              value={adminRatings[admin._id]?.average || 0}
                              precision={0.1}
                              readOnly
                              size={isMobile ? "small" : "small"}
                              sx={{ mr: 1 }}
                            />
                            <Typography variant={isMobile ? "caption" : "body2"} color="text.secondary">
                              {adminRatings[admin._id]?.average != null ? adminRatings[admin._id].average.toFixed(1) : '-'}
                              {adminRatings[admin._id]?.count ? ` (${adminRatings[admin._id].count})` : ''}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>

                      {/* Action Button */}
                      {isAuthenticated ? (
                        <Button 
                          variant="contained" 
                          fullWidth
                          startIcon={<ViewIcon />}
                          onClick={() => handleViewProfile(admin)}
                          sx={{ 
                            borderRadius: 2,
                            py: isMobile ? 1 : 1.5,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                            }
                          }}
                        >
                          View Full Profile
                        </Button>
                      ) : (
                        <Button 
                          variant="outlined" 
                          fullWidth
                          disabled
                          sx={{ 
                            borderRadius: 2,
                            py: isMobile ? 1 : 1.5,
                            borderColor: 'grey.300',
                            color: 'text.secondary'
                          }}
                        >
                          Login to View Profile
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {filteredAdmins.length === 0 && !loading && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: isMobile ? 3 : 6, 
                  borderRadius: 3, 
                  textAlign: 'center',
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  backgroundColor: 'grey.50'
                }}
              >
                <VerifiedIcon sx={{ fontSize: isMobile ? 60 : 80, color: 'grey.400', mb: isMobile ? 2 : 3 }} />
                <Typography variant={isMobile ? "h6" : "h5"} color="text.secondary" gutterBottom>
                  {hasActiveFilters ? 'No professionals found matching your filters' : 'No verified professionals found'}
                </Typography>
                <Typography variant={isMobile ? "body2" : "body1"} color="text.secondary" sx={{ mb: isMobile ? 2 : 3 }}>
                  {hasActiveFilters 
                    ? 'Try adjusting your search criteria or clear the filters to see all professionals.'
                    : 'Check back later for new verified professionals joining our platform.'
                  }
                </Typography>
                {hasActiveFilters && (
                  <Button
                    variant="contained"
                    onClick={clearFilters}
                    startIcon={<ClearIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Paper>
            )}
            
            {/* Enhanced Call to Action for non-authenticated users */}
            {!isAuthenticated && verifiedAdmins.length > 0 && (
              <Paper 
                elevation={0}
                sx={{ 
                  p: isMobile ? 3 : 6, 
                  borderRadius: 3, 
                  textAlign: 'center', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
                  <VerifiedIcon sx={{ fontSize: isMobile ? 120 : 200 }} />
                </Box>
                
                <VerifiedIcon sx={{ fontSize: isMobile ? 60 : 80, mb: isMobile ? 2 : 3, opacity: 0.9 }} />
                <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: 'bold', mb: isMobile ? 1 : 2 }}>
                  Unlock Full Access
                </Typography>
                <Typography variant={isMobile ? "body1" : "h6"} sx={{ mb: isMobile ? 2 : 3, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                  Login to access our complete database of verified professionals with detailed profiles, contact information, and reviews.
                </Typography>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'center' }}>
                  <Button 
                    variant="contained" 
                    size={isMobile ? "medium" : "large"}
                    startIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                    sx={{ 
                      backgroundColor: 'white', 
                      color: 'primary.main',
                      px: isMobile ? 2 : 4,
                      py: isMobile ? 1 : 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': { backgroundColor: 'grey.100' }
                    }}
                  >
                    Login Now
                  </Button>
                  <Button 
                    variant="outlined" 
                    size={isMobile ? "medium" : "large"}
                    onClick={() => navigate('/register')}
                    sx={{ 
                      borderColor: 'white', 
                      color: 'white',
                      px: isMobile ? 2 : 4,
                      py: isMobile ? 1 : 1.5,
                      borderRadius: 2,
                      fontWeight: 'bold',
                      '&:hover': { 
                        borderColor: 'white', 
                        backgroundColor: 'rgba(255,255,255,0.1)' 
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </Stack>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Profile Dialog */}
      <AdminProfileDialog
        open={profileDialogOpen}
        onClose={handleCloseDialog}
        admin={selectedAdmin}
        loading={profileLoading}
        onAdminUpdated={(updatedAdmin) => {
          // Refresh the admin list when an admin is updated
          fetchVerifiedAdmins();
        }}
        onAdminDeleted={(deletedAdminId) => {
          // Remove the deleted admin from the list
          setVerifiedAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== deletedAdminId));
        }}
      />

      
    </Box>
  );
};

export default AdminList;
