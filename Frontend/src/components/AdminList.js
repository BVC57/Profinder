import React, { useState, useEffect, useRef } from "react";
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
  useMediaQuery,
} from "@mui/material";
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
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  MedicalServices as DoctorIcon,
  School as TeacherIcon,
  Build as MechanicIcon,
  Handyman as PlumberIcon,
  ElectricalServices as ElectricianIcon,
  Computer as DeveloperIcon,
  LocalGroceryStore as ShopIcon,
  DirectionsCar as DriverIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "../api/axios";
import AdminProfileDialog from "../components/AdminProfileDialog";
import { motion } from "framer-motion";


const AdminList = () => {
  const searchBoxRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [verifiedAdmins, setVerifiedAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfession, setSelectedProfession] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [allProfessions, setAllProfessions] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [adminRatings, setAdminRatings] = useState({});
  const [islogin, setIsLogin] = useState(false);
  const getToken = localStorage.getItem("token");
  const isLoggedIn = Boolean(getToken);

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      title: "Find Professionals",
      description:
        "Search and discover verified professionals in your area with detailed profiles and reviews.",
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40, color: "success.main" }} />,
      title: "Verified Professionals",
      description:
        "All professionals are thoroughly verified to ensure quality and reliability.",
    },
    {
      icon: <AdminIcon sx={{ fontSize: 40, color: "info.main" }} />,
      title: "Best Service Providers",
      description:
        "Comprehensive admin tools to manage users, profiles, and platform operations.",
    },
    {
      icon: <SuperAdminIcon sx={{ fontSize: 40, color: "warning.main" }} />,
      title: "Top Rated Professionals",
      description:
        "Advanced administrative controls for platform-wide management and oversight.",
    },
  ];

  const categories = [
  { name: "Doctor", icon: <DoctorIcon fontSize="large" color="primary" /> },
  { name: "Teacher", icon: <TeacherIcon fontSize="large" color="secondary" /> },
  { name: "Electrician", icon: <ElectricianIcon fontSize="large" color="warning" /> },
  { name: "Mechanic", icon: <MechanicIcon fontSize="large" color="success" /> },
  { name: "Plumber", icon: <PlumberIcon fontSize="large" color="info" /> },
  { name: "Developer", icon: <DeveloperIcon fontSize="large" color="error" /> },
  { name: "Viyerman", icon: <ElectricianIcon fontSize="large" color="success" /> },
  { name: "Driver", icon: <DriverIcon fontSize="large" color="primary" /> },
  // ✅ Add more categories here...
];

  {
    /* Steps for How ProFinder Works Section */
  }
  const steps = [
    {
      num: 1,
      color: "primary.main",
      title: "Search",
      desc: "Browse through our extensive database of verified professionals in your area.",
    },
    {
      num: 2,
      color: "success.main",
      title: "Connect",
      desc: "Reach out to professionals through our secure messaging system.",
    },
    {
      num: 3,
      color: "info.main",
      title: "Collaborate",
      desc: "Work together with your chosen professional to achieve your goals.",
    },
    {
      num: 4,
      color: "warning.main",
      title: "Review",
      desc: "Share your experience and help others make informed decisions.",
    },
  ];


 const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Fetch verified admins
  const fetchVerifiedAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/admin/verified");
      const admins = response.data.map((admin) => ({
        ...admin,
        name: admin.userId?.name || "Unknown",
        profession: admin.profession,
        city: admin.city,
        experience: admin.experience,
      }));
      setVerifiedAdmins(admins);

      // Extract unique professions and locations for filters
      const professions = [
        ...new Set(admins.map((admin) => admin.profession).filter(Boolean)),
      ];
      const locations = [
        ...new Set(admins.map((admin) => admin.city).filter(Boolean)),
      ];
      setAllProfessions(professions);
      setAllLocations(locations);
      // Fetch ratings for all admins
      const ratings = {};
      await Promise.all(
        admins.map(async (admin) => {
          try {
            const res = await axios.get(
              `/api/user-requests/admin/${admin._id}/average-rating`
            );
            ratings[admin._id] = res.data;
          } catch (e) {
            ratings[admin._id] = { average: 0, count: 0 };
          }
        })
      );
      setAdminRatings(ratings);
    } catch (error) {
      console.error("Error fetching verified admins:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter admins based on search term and filters
  const filteredAdmins = verifiedAdmins.filter((admin) => {
    const matchesSearch =
      searchTerm === "" ||
      admin.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.profession?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProfession =
      selectedProfession === "" || admin.profession === selectedProfession;
    const matchesLocation =
      selectedLocation === "" || admin.city === selectedLocation;

    return matchesSearch && matchesProfession && matchesLocation;
  });

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProfession("");
    setSelectedLocation("");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedProfession || selectedLocation;

  // Handle view profile button click
  const handleViewProfile = async (admin) => {
    try {
      setProfileLoading(true);
      setSelectedAdmin(admin);
      setProfileDialogOpen(true);

      // Use the admin data we already have from the verified admins list
      // No need to fetch again as we already have all the required data
      console.log("Using admin profile:", admin);
    } catch (error) {
      console.error("Error setting admin profile:", error);
      setSelectedAdmin(admin); // Use basic info if there's any issue
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle dialog close
  const handleCloseDialog = () => {
    setProfileDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handleButtonClick = () => {
    if (isLoggedIn) {
      // 🔹 If logged in, focus on search box
      if (searchBoxRef.current) {
        searchBoxRef.current.focus();
      }
    } else {
      navigate("/register");
    }
  };

  useEffect(() => {
    fetchVerifiedAdmins();
  }, []);

  return (
    <Box sx={{ backgroundColor: "#f5f5f5" }}>
      <Paper
        elevation={0}
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 0,
          mb: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* 🔹 Content */}
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 0,
            mb: 0,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Container maxWidth="md">
           
              <Grid
                container
                spacing={4}
                justifyContent="center"
                alignItems="center"
                sx={{ position: "relative" }} // ✅ keep arrow relative only to this Grid
              >
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "2.5rem", md: "4rem" },
                    }}
                  >
                    Welcome to ProFinder
                  </Typography>

                  <Typography
                    paragraph
                    sx={{
                      opacity: 0.9,
                      fontSize: "20px",
                      maxWidth: "700px",
                      mx: "auto",
                    }}
                  >
                    Connecting you with verified professionals for all your
                    service needs. Trust, quality, and convenience in one
                    platform.
                  </Typography>

                  {/* 🔹 Animated Button */}
                  <Box sx={{ mt: 4 }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={handleButtonClick}
                        sx={{
                          borderRadius: "50px",
                          px: 4,
                          py: 1.5,
                          fontSize: "1rem",
                          textTransform: "none",
                          borderColor: "#fff",
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#fff",
                            color: "#1976d2",
                          },
                        }}
                      >
                        {isLoggedIn ? "Search Professional" : "Join Now"}
                      </Button>
                    </motion.div>
                  </Box>

                  
                </Grid>
            </Grid>
          </Container>
        </Paper>
      </Paper>

      {/* Verified Professionals Section */}
      <Container
        maxWidth="lg"
        sx={{ mb: 8, borderRadius: 4, backgroundColor: "#f5f7fa", p: 4 }}
      >
        {/* Title Section */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            mb: { xs: 4, sm: 5 },
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          Our Verified Professionals
        </Typography>
        <Box sx={{ textAlign: "center", mb: isMobile ? 4 : 8 }}>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.7 }}
          >
            Discover trusted professionals in your area.{" "}
          </Typography>
          <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.7 }}
          >
            {!isAuthenticated && (
              <strong>Login to see full profiles and connect with them.</strong>
            )}
          </Typography>
        </Box>

        {/* Search & Filter Section */}
        <Paper
          sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            background: "linear-gradient(135deg, #f9f9f9, #ffffff)",
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent={"center"}>
            {/* Search Input */}
            <Grid item xs={12} md={4} ali>
              <TextField
                placeholder="🔍 Search by name, profession, or city"
                value={searchTerm}
                inputRef={searchBoxRef}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                size="medium"
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    "& fieldset": { border: "none" },
                    "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                  },
                }}
              />
            </Grid>

            {/* Profession Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
                <Select
                  displayEmpty
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="">All Professions</MenuItem>
                  {allProfessions.map((profession) => (
                    <MenuItem key={profession} value={profession}>
                      {profession}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* City Filter */}
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="medium">
                <Select
                  displayEmpty
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                    "& fieldset": { border: "none" },
                  }}
                >
                  <MenuItem value="">All Cities</MenuItem>
                  {allLocations.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Buttons + Results */}
            <Grid item xs={12} md={2}>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Button
                  variant="contained"
                  size="medium"
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    py: 1.2,
                    textTransform: "none",
                    background:
                      "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #5b0eb3 0%, #1f65e0 100%)",
                    },
                  }}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Loader */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
              <CircularProgress size={70} thickness={4} />
            </Box>
          ) : (
            <>
              {/* Professionals Grid */}
              <Grid
                container
                spacing={isMobile ? 2 : 4}
                justifyContent="center"
                alignItems="stretch"
              >
                {filteredAdmins.slice(0, 4).map((admin, index) => (
            <Grid item xs={12} sm={6} md={4} key={admin._id || index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                {/* Gradient Header */}
                <Box
                  sx={{
              background:
                "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              p: 3,
              color: "white",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={
                  admin.profilePhoto
                    ? `${process.env.REACT_APP_API_URL}/uploads/${admin.profilePhoto}`
                    : undefined
                }
                sx={{
                  width: 60,
                  height: 60,
                  mr: 2,
                  bgcolor: "rgba(255,255,255,0.2)",
                  fontSize: "1.5rem",
                }}
              >
                {admin.name?.charAt(0).toUpperCase() || "P"}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {admin.name}
                </Typography>
                <Chip
                  label="✅ Verified"
                  size="small"
                  sx={{
                    mt: 0.5,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "white",
                  }}
                />
              </Box>
                  </Box>
                </Box>

                {/* Card Content */}
                <CardContent>
                  <Typography
              variant="subtitle1"
              color="primary"
              fontWeight="bold"
                  >
              {admin.profession}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={1.5}>
              <Typography variant="body2" color="text.secondary">
                📍 {admin.city}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⏳ {admin.experience} years of experience
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ⭐{" "}
                {adminRatings[admin._id]?.average?.toFixed(1) || "-"}{" "}
                ({adminRatings[admin._id]?.count || 0} reviews)
              </Typography>
                  </Stack>
                </CardContent>

                {/* Action Button */}
                <Box sx={{ p: 2 }}>
                  {isAuthenticated ? (
              <Button
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: 3,
                  textTransform: "none",
                  background:
                    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                }}
                onClick={() => handleViewProfile(admin)}
              >
                View Profile
              </Button>
                  ) : (
              <Button variant="outlined" fullWidth disabled>
                Login to View Profile
              </Button>
                  )}
                </Box>
              </Card>
            </Grid>
                ))}
              </Grid>

             { /* Empty State */}
                  {filteredAdmins.length === 0 && !loading && (
                    <Paper
                    sx={{
                      p: 5,
                      mt: 4,
                      textAlign: "center",
                      borderRadius: 3,
                      background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                    }}
                    >
                    <VerifiedIcon sx={{ fontSize: 70, color: "grey.600", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No professionals found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Try adjusting your search filters or check back later for more
                  verified professionals.
                </Typography>
                <Button variant="contained" onClick={clearFilters}>
                  Reset Filters
                </Button>
              </Paper>
            )}
          </>
        )}
      </Container>

      {/* Categories Section */}
      <Container sx={{ mt: 6, mb: 6 }}>
      {/* Heading */}
      <Typography
          variant="h1"
          component="h1"
          textAlign="center"
          gutterBottom
          sx={{ mb: 6, fontWeight: "bold", color: "primary.main", }}
        >
        Explore Categories
        </Typography>
      <Typography
            variant={isMobile ? "body1" : "h6"}
            color="text.secondary"
            sx={{ maxWidth: 650, mx: "auto", lineHeight: 1.7, marginBottom:5, alignItems:"center", textAlign:"center" }}
          >
        Find professionals across various fields. Select a category to get started!
      </Typography>

      {/* Categories Grid */}
      <Grid container spacing={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {filteredCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index} >
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  borderRadius: 3,
                  height:"100%",
                  width:"150%",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                    bgcolor: "white",
                    color: "blue",
                    zIndex:-1,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 1 }}>{category.icon}</Box>
                  <Typography variant="h6">{category.name}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Container>


      {/* Features Section */}
      <Container
        maxWidth="lg"
        sx={{
          mb: 8, // more bottom margin for spacing
          mt: 8, // top margin
          px: 2,
        }}
      >
        {/* Section Heading */}
        <Typography
          variant="h1"
          component="h1"
          textAlign="center"
          
          sx={{ mb: 6, fontWeight: "bold", color: "primary.main", }}
        >
          Why Choose ProFinder?
        </Typography>

        {/* Features Grid */}
        <Grid container spacing={4} >
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={4}
                sx={{
                  height: "100%", // ensures equal card height
                  minHeight: 250, // set a minimum so all are uniform
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                  },
                  borderRadius: 3,
                  textAlign: "center",
                  px: 2,
                  py: 3,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      mb: 3,
                      fontSize: 40,
                      color: "primary.main",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
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

      {/* How ProFinder Works Section */}
      <Container
        maxWidth="lg"
        sx={{
          mb: { xs: 5, sm: 6, md: 8 },
          py: { xs: 5, sm: 6, md: 8 },

          backgroundColor: "#f5f7fa", // 🌟 Section background
          borderRadius: 3,
        }}
      >
        {/* Section Heading */}
        <Typography
          variant={isMobile ? "h4" : "h3"}
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{
            mb: { xs: 4, sm: 5 },
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: "bold",
            color: "primary.main",
          }}
        >
          How ProFinder Works
        </Typography>

        <Grid container spacing={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {[
            {
              num: 1,
              color: "primary.main",
              title: "Search",
              desc: "Find verified experts",
            },
            {
              num: 2,
              color: "success.main",
              title: "Connect",
              desc: "Message professionals securely",
            },
            {
              num: 3,
              color: "info.main",
              title: "Collaborate",
              desc: "Work together effectively",
            },
            {
              num: 4,
              color: "warning.main",
              title: "Review",
              desc: "Share helpful feedback",
            },
            
          ].map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                elevation={4}
                sx={{
                  textAlign: "center",
                  p: { xs: 3, sm: 4 },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 9,
                  },
                }}
              >
                {/* Number Circle */}
                <Box
                  sx={{
                    width: { xs: 55, sm: 60, md: 70 },
                    height: { xs: 55, sm: 60, md: 70 },
                    borderRadius: "50%",
                    backgroundColor: step.color,
                    color: "white",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    mx: "auto",
                    mb: 2.5,
                  }}
                >
                  {step.num}
                </Box>

                {/* Step Title */}
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{
                    fontSize: { xs: "1.25rem", sm: "1.4rem", md: "1.5rem" },
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  {step.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  {step.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: 3,
          p: { xs: 4, md: 6 },
          mt: 6,
          mb: 4,
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
          }}
        >
          Ready to Get Started?
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            mb: 4,
            maxWidth: 700,
            mx: "auto",
            opacity: 0.9,
          }}
        >
          Join thousands of users and professionals on ProFinder today.
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          {/* Sign Up Button → Register */}
          <Button
            variant="outlined"
            size="large"
            sx={{
              bgcolor: "transparent",
              borderColor: "white",
              color: "white",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
              },
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
            onClick={handleRegister}
          >
            Sign Up Now
          </Button>

          {/* Learn More Button → Login */}
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: "white",
              color: "black",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
            }}
            onClick={handleLogin}
          >
            Learn More
          </Button>
        </Box>
      </Box>

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
          setVerifiedAdmins((prevAdmins) =>
            prevAdmins.filter((admin) => admin._id !== deletedAdminId)
          );
        }}
      />
    </Box>
  );
};

export default AdminList;
