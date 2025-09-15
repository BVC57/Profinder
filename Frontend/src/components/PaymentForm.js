import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  ContactSupport as ContactSupportIcon,
} from "@mui/icons-material";
import RazorpayButton from "./RazorpayButton";

const PaymentForm = ({ onPaymentSuccess, onClose, admin }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "consultation",
    description: "",
    paymentMethod: "razorpay",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const steps = [
    {
      label: "Contact Information",
      icon: <ContactSupportIcon />,
    },
    {
      label: "Service Details",
      icon: <DescriptionIcon />,
    },
    {
      label: "Payment",
      icon: <PaymentIcon />,
    },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentSuccess = () => {
    onPaymentSuccess();
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0:
        return formData.name && formData.phone && formData.email;
      case 1:
        return formData.serviceType && formData.description;
      case 2:
        return formData.paymentMethod;
      default:
        return false;
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Request Services from {admin?.name}
      </Typography>
      
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={() => (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: activeStep >= index ? "primary.main" : "grey.300",
                  color: activeStep >= index ? "white" : "grey.600"
                }}>
                  {step.icon}
                </Box>
              )}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {step.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                {index === 0 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                      Please provide your contact information
                    </Typography>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </Stack>
                )}

                {index === 1 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                      Tell us about your service requirements
                    </Typography>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Service Type</FormLabel>
                      <RadioGroup
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange("serviceType", e.target.value)}
                      >
                        <FormControlLabel 
                          value="consultation" 
                          control={<Radio />} 
                          label="Professional Consultation" 
                        />
                        <FormControlLabel 
                          value="advice" 
                          control={<Radio />} 
                          label="Expert Advice" 
                        />
                        <FormControlLabel 
                          value="service" 
                          control={<Radio />} 
                          label="Direct Service" 
                        />
                      </RadioGroup>
                    </FormControl>
                    <TextField
                      fullWidth
                      label="Service Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Please describe your requirements in detail..."
                      required
                    />
                  </Stack>
                )}

                {index === 2 && (
                  <Stack spacing={3}>
                    <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                      Complete Payment (₹5)
                    </Typography>
                    
                    <Paper elevation={2} sx={{ p: 3, bgcolor: "grey.50" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h6">Service Fee</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                          ₹5.00
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Total Amount</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                          ₹5.00
                        </Typography>
                      </Box>
                    </Paper>

                    <FormControl component="fieldset">
                      <FormLabel component="legend">Payment Method</FormLabel>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                      >
                        <FormControlLabel 
                          value="razorpay" 
                          control={<Radio />} 
                          label="Pay with Razorpay (Credit/Debit Card, UPI, Net Banking)" 
                        />
                      </RadioGroup>
                    </FormControl>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}

                    <RazorpayButton 
                      amount={500} 
                      onSuccess={handlePaymentSuccess}
                      disabled={loading}
                    />
                  </Stack>
                )}

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="outlined"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  {index !== 2 && (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={!isStepValid(index)}
                      sx={{
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                        },
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PaymentForm; 