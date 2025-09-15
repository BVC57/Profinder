import React, { useState, useEffect } from "react";
  import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Box,
    Typography,
    Avatar,
    Chip,
    Grid,
    Paper,
    Stack,
    Rating,
    Button,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Alert,
    DialogContentText,
    useTheme,
    useMediaQuery,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Card,
    CardContent,
    Divider,
  } from "@mui/material";
  import {
    Close as CloseIcon,
    Work as WorkIcon,
    LocationOn as LocationIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    AccessTime as TimeIcon,
    Star as StarIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Payment as PaymentIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
  } from "@mui/icons-material";
  import RazorpayButton from "./RazorpayButton";
  import SuccessMessage from "./SuccessMessage";
  import EditAdminDialog from "./EditAdminDialog";
  import { useAuth } from "../contexts/AuthContext";
  import axios from "../api/axios";
  import { useNavigate } from "react-router-dom";

  const AdminProfileDialog = ({
    open,
    onClose,
    admin,
    loading,
    onAdminUpdated,
    onAdminDeleted,
  }) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [paymentDone, setPaymentDone] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const menuOpen = Boolean(anchorEl);
    const [adminRating, setAdminRating] = useState({ average: 0, count: 0 });

    // Stepper state
    const [activeStep, setActiveStep] = useState(0);
    const [stepperOpen, setStepperOpen] = useState(false);
    const [requestData, setRequestData] = useState({
      serviceType: '',
      description: '',
      preferredDate: '',
      preferredTime: '',
      estimatedDays: 7, // Default to 1 week
    });
    const [paymentLoading, setPaymentLoading] = useState(false);

    const steps = [
      {
        label: 'Request Services Form',
        description: 'Fill in your service request details',
        icon: <AssignmentIcon />
      },
      {
        label: 'Payment',
        description: 'Complete payment to proceed',
        icon: <PaymentIcon />
      }
    ];

    useEffect(() => {
      if (admin && admin._id) {
        axios
          .get(`/api/user-requests/admin/${admin._id}/average-rating`)
          .then((res) => {
            setAdminRating(res.data);
          })
          .catch(() => setAdminRating({ average: 0, count: 0 }));
      }
    }, [admin]);

    const handleContactProfessional = () => {
      if (user.role === "user") {
        setStepperOpen(true);
        setActiveStep(0);
        setPaymentLoading(false);
        setRequestData({
          serviceType: '',
          description: '',
          preferredDate: '',
          preferredTime: '',
          estimatedDays: 7,
        });
      } else {
        onClose();
      }
    };

    // Stepper navigation functions
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
      setActiveStep(0);
      setStepperOpen(false);
      setPaymentDone(false);
      setPaymentLoading(false);
      setRequestData({
        serviceType: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        estimatedDays: 7,
      });
    };

    const handleStepComplete = (stepData) => {
      setRequestData(prev => ({ ...prev, ...stepData }));
      handleNext();
    };

    // Payment success handler with history saving
    const handlePaymentSuccess = async (paymentDetails) => {
      setPaymentDone(true);
      setPaymentLoading(true);
      
      try {
        // Create the actual request in the database
        const response = await axios.post('/api/user-requests/create', {
          adminId: admin._id,
          title: requestData.serviceType,
          description: requestData.description,
          estimatedDays: requestData.estimatedDays,
          preferredDate: requestData.preferredDate,
          preferredTime: requestData.preferredTime,
          paymentAmount: 500, // 5 Rs in paise
          paymentStatus: 'completed'
        });

        // Save payment history directly to the backend
        await axios.post('/api/admin/savepayments', {
          adminId: admin._id,
          adminName: admin.name || 'Unknown',
          adminProfession: admin.profession || 'Professional',
          serviceType: requestData.serviceType,
          description: requestData.description,
          preferredDate: requestData.preferredDate,
          preferredTime: requestData.preferredTime,
          amount: 500, // 5 Rs in paise
          status: 'success',
          paymentDate: new Date().toISOString(),
          paymentDetails: paymentDetails,
          requestId: response.data.request._id, // Link to the created request
          userId: user.id // Add the user ID for filtering
        });
        
        // Show success message
        setSuccessMessage("Payment successful! Your service request has been submitted and will appear in your requests list.");
        setShowSuccess(true);
        navigate('/requests');
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
        
        // Close stepper
        setStepperOpen(false);
        setActiveStep(0);
      } catch (error) {
        console.error('Error creating request:', error);
        // Even if request creation fails, save payment record directly to the backend
        try {
          await axios.post('/api/admin/savepayments', {
            adminId: admin._id,
            adminName: admin.name || 'Unknown',
            adminProfession: admin.profession || 'Professional',
            serviceType: requestData.serviceType,
            description: requestData.description,
            preferredDate: requestData.preferredDate,
            preferredTime: requestData.preferredTime,
            amount: 500,
            status: 'success',
            paymentDate: new Date().toISOString(),
            paymentDetails: paymentDetails,
            error: 'Payment successful but request creation failed',
            userId: user.id // Add the user ID for filtering
          });
        } catch (err) {
          console.error('Error saving payment record:', err);
        }
        
        setError("Payment was successful, but there was an issue creating your request. Please contact support.");
      } finally {
        setPaymentLoading(false);
      }
    };

    // Payment failure handler
    const handlePaymentFailure = async (error) => {
      try {
        // Save failed payment history directly to the backend
        await axios.post('/api/admin/savepayments', {
          adminId: admin._id,
          adminName: admin.name || 'Unknown',
          adminProfession: admin.profession || 'Professional',
          serviceType: requestData.serviceType,
          description: requestData.description,
          preferredDate: requestData.preferredDate,
          preferredTime: requestData.preferredTime,
          amount: 500,
          status: 'failed',
          paymentDate: new Date().toISOString(),
          error: error,
          userId: user.id // Add the user ID for filtering
        });
      } catch (err) {
        console.error('Error saving failed payment record:', err);
      }
      
      // Show error message
      setError("Payment failed. Please try again.");
    };

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handleEdit = () => {
      handleMenuClose();
      setEditDialogOpen(true);
    };

    const handleEditClose = () => {
      setEditDialogOpen(false);
    };

    const handleEditSuccess = (updatedAdmin) => {
      if (onAdminUpdated) {
        onAdminUpdated(updatedAdmin);
      }
      setSuccessMessage("Admin profile updated successfully!");
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    };

    const handleDelete = () => {
      handleMenuClose();
      setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
      try {
        setActionLoading(true);
        setError("");

        await axios.delete(`/api/admin/profile/${admin._id}`);

        setDeleteDialogOpen(false);
        onClose();

        // Notify parent component
        if (onAdminDeleted) {
          onAdminDeleted(admin._id);
        }

        setSuccessMessage("Admin profile deleted successfully!");
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } catch (err) {
        console.error("Error deleting admin:", err);
        setError(err.response?.data?.message || "Failed to delete admin profile");
      } finally {
        setActionLoading(false);
      }
    };

    const handleDeleteCancel = () => {
      setDeleteDialogOpen(false);
      setError("");
    };

    const handleCloseDialog = () => {
      handleMenuClose();
      onClose();
    };

    // Get profile photo URL
    const getProfilePhotoUrl = () => {
      if (admin.profilePhoto) {
        return `${process.env.REACT_APP_API_URL || "http://192.168.31.3:5000"}/uploads/${admin.profilePhoto}`;
      }
      return null;
    };

    if (loading) {
      return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 8,
              minHeight: 400,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        </Dialog>
      );
    }

    if (!admin) return null;

    return (
      <>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          {/* Header with gradient background */}
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 3,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{ position: "absolute", top: -30, right: -30, opacity: 0.1 }}
            >
              <WorkIcon sx={{ fontSize: 120 }} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={getProfilePhotoUrl()}
                  sx={{
                    width: isMobile ? 60 : 80,
                    height: isMobile ? 60 : 80,
                    mr: isMobile ? 2 : 3,
                    bgcolor: "rgba(255,255,255,0.2)",
                    fontSize: isMobile ? "1.5rem" : "2rem",
                    fontWeight: "bold",
                    border: "3px solid rgba(255,255,255,0.3)",
                  }}
                >
                  {admin.name?.charAt(0)?.toUpperCase() || "P"}
                </Avatar>
                <Box>
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      fontSize: isMobile ? "1.25rem" : undefined,
                    }}
                  >
                    {admin.name}
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{
                      opacity: 0.9,
                      mb: 1,
                      fontSize: isMobile ? "0.9rem" : undefined,
                    }}
                  >
                    {admin.profession}
                  </Typography>
                  <Chip
                    label="✅ Verified Professional"
                    size={isMobile ? "small" : "medium"}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: "medium",
                      fontSize: isMobile ? "0.75rem" : undefined,
                    }}
                  />
                </Box>
              </Box>
              <Box>
                {user.role === "superadmin" && (
                  <>
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{ color: "white" }}
                      aria-label="Open menu"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={menuOpen}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleEdit}>
                        <ListItemIcon>
                          <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Edit</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleDelete}>
                        <ListItemIcon>
                          <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={handleCloseDialog}>
                        <ListItemIcon>
                          <CloseIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Close</ListItemText>
                      </MenuItem>
                    </Menu>
                  </>
                )}
                {user.role !== "superadmin" && (
                  <IconButton
                    onClick={onClose}
                    sx={{
                      color: "white",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                    }}
                    aria-label="Close dialog"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>

          {/* At the top of the dialog, show the rating */}

          <DialogContent sx={{ p: 0 }}>
            <Box sx={{ p: isMobile ? 2 : 3 }}>
              {/* Key Information Grid */}
              <Grid
                container
                spacing={isMobile ? 2 : 3}
                sx={{ mb: isMobile ? 3 : 4 }}
              >
                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isMobile ? 2 : 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: "primary.main",
                        fontSize: isMobile ? "1rem" : undefined,
                      }}
                    >
                      Professional Information
                    </Typography>
                    <Stack spacing={isMobile ? 1.5 : 2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <WorkIcon
                          sx={{
                            color: "primary.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Profession
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                          >
                            {admin.profession}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TimeIcon
                          sx={{
                            color: "primary.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Experience
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                          >
                            {admin.experience} years
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StarIcon
                          sx={{
                            color: "warning.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Rating
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Rating
                              value={adminRating.average || 0}
                              readOnly
                              size={isMobile ? "small" : "small"}
                              sx={{ mr: 1 }}
                            />
                            <Typography
                              variant="body1"
                              fontWeight="medium"
                              sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                            >
                              {adminRating.average != null
                                ? adminRating.average.toFixed(1)
                                : "-"}
                              {adminRating.count ? ` (${adminRating.count})` : ""}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: isMobile ? 2 : 3,
                      border: "1px solid",
                      borderColor: "grey.200",
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        color: "primary.main",
                        fontSize: isMobile ? "1rem" : undefined,
                      }}
                    >
                      Location & Contact
                    </Typography>
                    <Stack spacing={isMobile ? 1.5 : 2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <LocationIcon
                          sx={{
                            color: "primary.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Location
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                          >
                            {admin.city}, {admin.pincode}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <EmailIcon
                          sx={{
                            color: "primary.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                          >
                            {admin.email || "Not provided"}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <PhoneIcon
                          sx={{
                            color: "primary.main",
                            mr: isMobile ? 1 : 2,
                            fontSize: isMobile ? 16 : 20,
                          }}
                        />
                        <Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontSize: isMobile ? "0.75rem" : undefined }}
                          >
                            Phone
                          </Typography>
                          <Typography
                            variant="body1"
                            fontWeight="medium"
                            sx={{ fontSize: isMobile ? "0.85rem" : undefined }}
                          >
                            {admin.phone || admin.mobile || "Not provided"}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>

              {/* Additional Information */}
              {admin.bio && (
                <Paper
                  elevation={0}
                  sx={{
                    p: isMobile ? 2 : 3,
                    border: "1px solid",
                    borderColor: "grey.200",
                    borderRadius: 2,
                    mb: 3,
                  }}
                >
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{
                      fontWeight: "bold",
                      mb: 2,
                      color: "primary.main",
                      fontSize: isMobile ? "1rem" : undefined,
                    }}
                  >
                    About
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: isMobile ? "0.85rem" : undefined,
                    }}
                  >
                    {admin.bio}
                  </Typography>
                </Paper>
              )}
              {/* Services or Specializations */}
              <Paper
                elevation={0}
                sx={{
                  p: isMobile ? 2 : 3,
                  border: "1px solid",
                  borderColor: "grey.200",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{
                    fontWeight: "bold",
                    mb: 2,
                    color: "primary.main",
                    fontSize: isMobile ? "1rem" : undefined,
                  }}
                >
                  Services & Specializations
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: isMobile ? 0.5 : 1,
                  }}
                >
                  <Chip
                    label="Professional Consultation"
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontSize: isMobile ? "0.7rem" : undefined }}
                  />
                  <Chip
                    label="Expert Advice"
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontSize: isMobile ? "0.7rem" : undefined }}
                  />
                  <Chip
                    label="Quality Service"
                    color="primary"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontSize: isMobile ? "0.7rem" : undefined }}
                  />
                  <Chip
                    label="Verified Professional"
                    color="success"
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    sx={{ fontSize: isMobile ? "0.7rem" : undefined }}
                  />
                </Box>
              </Paper>
            </Box>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button variant="outlined" onClick={onClose} sx={{ mr: 1 }}>
              Close
            </Button>
            {user.role === "user" && (
              <Button
                variant="contained"
                startIcon={<EmailIcon />}
                onClick={handleContactProfessional}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                }}
              >
                Request Services
              </Button>
            )}
          </DialogActions>
        </Dialog>

        {/* Stepper Dialog */}
        <Dialog
          open={stepperOpen}
          onClose={handleReset}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Request Service - {admin?.name}
            </Typography>
            <IconButton
              onClick={handleReset}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        bgcolor: activeStep >= index ? 'primary.main' : 'grey.300',
                        color: activeStep >= index ? 'white' : 'grey.600'
                      }}>
                        {step.icon}
                      </Box>
                    )}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {step.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2, mt: 2 }}>
                      {index === 0 && (
                        <RequestFormStep 
                          data={requestData}
                          onComplete={handleStepComplete}
                          onBack={handleBack}
                        />
                      )}
                      {index === 1 && (
                        <PaymentStep 
                          onComplete={handlePaymentSuccess}
                          onFailure={handlePaymentFailure}
                          onBack={handleBack}
                          loading={paymentLoading}
                        />
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </DialogContent>
        </Dialog>

        {/* Payment History Dialog */}
        <Dialog
          open={false} // Payment history is now managed by context, so this dialog is no longer needed
          onClose={() => {}}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: "hidden",
            },
          }}
        >
          <DialogTitle sx={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Payment History
            </Typography>
            <IconButton
              onClick={() => {}}
              sx={{ color: "white" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            {/* Payment history is now managed by context, so this section is removed */}
          </DialogContent>
        </Dialog>

        {/* Edit Admin Dialog */}
        <EditAdminDialog
          open={editDialogOpen}
          onClose={handleEditClose}
          admin={admin}
          onAdminUpdated={handleEditSuccess}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this admin profile? This action
              cannot be undone.
            </DialogContentText>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} disabled={actionLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
              disabled={actionLoading}
            >
              {actionLoading ? <CircularProgress size={20} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment and Create Request Dialog */}
        {/* This dialog is now handled by the stepper */}

        {/* Success Message */}
        {showSuccess && (
          <SuccessMessage
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </>
    );
  };

  // Step Components
  const RequestFormStep = ({ data, onComplete, onBack }) => {
    const [serviceType, setServiceType] = useState(data.serviceType || '');
    const [description, setDescription] = useState(data.description || '');
    const [preferredDate, setPreferredDate] = useState(data.preferredDate || '');
    const [preferredTime, setPreferredTime] = useState(data.preferredTime || '');
    const [estimatedDays, setEstimatedDays] = useState(data.estimatedDays || 7);

    const handleNext = () => {
      if (serviceType && description && preferredDate && preferredTime) {
        onComplete({ serviceType, description, preferredDate, preferredTime, estimatedDays });
      }
    };

    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Request Service Details
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Service Type *
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['Consultation', 'Advice', 'Professional Service', 'Expert Opinion'].map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onClick={() => setServiceType(type)}
                  color={serviceType === type ? 'primary' : 'default'}
                  variant={serviceType === type ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Description *
            </Typography>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your service requirement in detail..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontFamily: 'inherit',
                fontSize: '14px',
                resize: 'vertical'
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preferred Date *
            </Typography>
            <input
              type="date"
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              min={new Date().toISOString().split('T')[0]}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Preferred Time *
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map((time) => (
                <Chip
                  key={time}
                  label={time}
                  onClick={() => setPreferredTime(time)}
                  color={preferredTime === time ? 'primary' : 'default'}
                  variant={preferredTime === time ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Estimated Timeline (Days) *
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {[1, 2, 3, 5, 7, 14, 30].map((days) => (
                <Chip
                  key={days}
                  label={days === 1 ? '1 Day' : days === 7 ? '1 Week' : days === 14 ? '2 Weeks' : days === 30 ? '1 Month' : `${days} Days`}
                  onClick={() => setEstimatedDays(days)}
                  color={estimatedDays === days ? 'primary' : 'default'}
                  variant={estimatedDays === days ? 'filled' : 'outlined'}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onBack} disabled={true}>
              Back
            </Button>
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={!serviceType || !description || !preferredDate || !preferredTime}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              Next
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const PaymentStep = ({ onComplete, onFailure, onBack, loading }) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Payment
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            py: 3
          }}>
           
            
            <RazorpayButton 
              amount={500} 
              onSuccess={onComplete}
              onFailure={onFailure}
              buttonText="Pay ₹5.00"
              loading={loading}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={onBack}>
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  export default AdminProfileDialog;
