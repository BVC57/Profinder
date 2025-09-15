import React, { useState,useEffect } from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Alert, 
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Grid
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const ComprehensivePaymentHandler = ({ 
  open,
  onClose,
  onSuccess, 
  onFailure, 
  onPending,
  adminId = null,
  requestId = null,
  amount = 500,
  description = "Service Request Payment",
  paymentType = "ServiceRequest",
  showPaymentHistory = false
}) => {
  const userId = localStorage.getItem("userId") || "defaultUserId";
  const razorpayCheckoutId = localStorage.getItem("rzp_stored_checkout_id") || "N/A";
  const navigate = useNavigate();
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentDetailOpen, setPaymentDetailOpen] = useState(false);

  const steps = [
    {
      label: 'Payment Initiation',
      description: 'Initializing payment gateway...'
    },
    {
      label: 'Payment Processing',
      description: 'Processing your payment...'
    },
    {
      label: 'Payment Verification',
      description: 'Verifying payment details...'
    },
    {
      label: 'Request Creation',
      description: 'Creating your service request...'
    }
  ];

  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to save payment details with comprehensive status handling
  const savePaymentDetails = async (paymentData) => {
    try {
      const saveRes = await axios.post("/api/admin/savepayments", paymentData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("✅ Payment details saved:", saveRes.data);
      setPaymentDetails(saveRes.data.payment);
      return saveRes.data.payment;
    } catch (error) {
      console.error("❌ Error saving payment details:", error.response?.data || error.message);
      throw error;
    }
  };

  // Function to update payment status
  const updatePaymentStatus = async (paymentId, status, failureReason = null) => {
    try {
      await axios.put(`/api/admin/payments/${paymentId}/status`, {
        paymentStatus: status,
        failureReason
      });
      console.log(`✅ Payment status updated to: ${status}`);
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
    }
  };

  // Function to fetch payment history
  const fetchPaymentHistory = async () => {
    setLoadingPayments(true);
    try {
      const response = await axios.get(`/api/admin/payments/user/${userId}`);
      console.log('Payment history response:', response.data);
      if (response.data.success) {
        setPayments(response.data.payments);
        console.log('Payments set:', response.data.payments);
      }
    } catch (error) {
      console.error("❌ Error fetching payment history:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Fetch payment history when dialog opens
  useEffect(() => {
    if (open && showPaymentHistory) {
      fetchPaymentHistory();
    }
  }, [open, showPaymentHistory]);

  // Function to handle payment item click
  const handlePaymentClick = (payment) => {
    console.log('Payment clicked:', payment);
    setSelectedPayment(payment);
    setPaymentDetailOpen(true);
  };

  // Function to close payment detail dialog
  const handleClosePaymentDetail = () => {
    setPaymentDetailOpen(false);
    setSelectedPayment(null);
  };

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setPaymentStatus(null);
    setActiveStep(0);

    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    setActiveStep(1);

    const options = {
      key: "rzp_test_VYCmeh1TIdQJcm", // Razorpay Test Key
      amount: amount,
      currency: "INR",
      name: "ProFinder Payment",
      description: description,
      image: "https://your-logo-url.com/logo.png",
      handler: async function (response) {
        console.log("Payment successful:", response);
        setPaymentStatus("Success");
        setActiveStep(2);

        try {
          // Save successful payment with comprehensive details
          const paymentData = {
            userId: userId,
            adminId: adminId,
            requestId: requestId,
            amount: amount / 100,
            currency: "INR",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: razorpayCheckoutId || response.razorpay_order_id || "N/A",
            razorpaySignature: response.razorpay_signature || "N/A",
            paymentMethod: "Razorpay",
            paymentStatus: "Success",
            paymentType: paymentType,
            description: description,
            metadata: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              checkoutId: razorpayCheckoutId,
              success: true,
              paymentGateway: "Razorpay"
            },
            paymentDate: new Date().toISOString(),
          };

          const savedPayment = await savePaymentDetails(paymentData);
          setActiveStep(3);
          
          if (onSuccess) {
            onSuccess(savedPayment);
          } else {
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        } catch (error) {
          setError("Payment successful but failed to save details. Please contact support.");
          console.error("Payment save error:", error);
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed");
          setPaymentStatus("Cancelled");
          setLoading(false);
          
          // Save cancelled payment
          const paymentData = {
            userId: userId,
            adminId: adminId,
            requestId: requestId,
            amount: amount / 100,
            currency: "INR",
            razorpayPaymentId: "CANCELLED_" + Date.now(),
            razorpayOrderId: razorpayCheckoutId || "N/A",
            paymentMethod: "Razorpay",
            paymentStatus: "Cancelled",
            paymentType: paymentType,
            description: description,
            failureReason: "User cancelled the payment",
            metadata: {
              userAgent: navigator.userAgent,
              timestamp: new Date().toISOString(),
              checkoutId: razorpayCheckoutId,
              cancelled: true
            },
            paymentDate: new Date().toISOString(),
          };

          savePaymentDetails(paymentData).catch(console.error);
        },
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "ProFinder Address",
      },
      theme: {
        color: "#4362dfff",
      },
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (resp) {
        console.log("Payment failed:", resp.error);
        setPaymentStatus("Failed");
        setLoading(false);

        // Save failed payment with detailed error information
        const paymentData = {
          userId: userId,
          adminId: adminId,
          requestId: requestId,
          amount: amount / 100,
          currency: "INR",
          razorpayPaymentId: "FAILED_" + Date.now(),
          razorpayOrderId: razorpayCheckoutId || "N/A",
          paymentMethod: "Razorpay",
          paymentStatus: "Failed",
          paymentType: paymentType,
          description: description,
          failureReason: resp.error.description || "Payment failed",
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString(),
            checkoutId: razorpayCheckoutId,
            errorCode: resp.error.code,
            errorSource: resp.error.source,
            errorStep: resp.error.step,
            errorReason: resp.error.reason,
            failed: true
          },
          paymentDate: new Date().toISOString(),
        };

        savePaymentDetails(paymentData).catch(console.error);

        if (onFailure) {
          onFailure(resp.error);
        } else {
          setError("Payment failed: " + (resp.error.description || "Unknown error"));
        }
      });

      paymentObject.open();
    } catch (error) {
      setError("Failed to initialize payment. Please try again.");
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case "Success":
        return <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "white" }} />;
      case "Failed":
        return <ErrorOutlineIcon sx={{ fontSize: 80, color: "red" }} />;
      case "Pending":
        return <PendingIcon sx={{ fontSize: 80, color: "orange" }} />;
      default:
        return <PaymentIcon sx={{ fontSize: 80, color: "white" }} />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case "Success":
        return "Payment successful! Your request has been submitted.";
      case "Failed":
        return "Payment failed. Please try again.";
      case "Pending":
        return "Payment is being processed...";
      default:
        return "We charge a small ₹5 refundable amount to prevent fake or spammy service requests. This helps us ensure real professionals get genuine leads. Thank you for understanding!";
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case "Success":
        return "#00C853";
      case "Failed":
        return "#f44336";
      case "Pending":
        return "#ff9800";
      default:
        return "#00C853";
    }
  };

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
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: `linear-gradient(135deg, ${getStatusColor()} 0%, ${getStatusColor()}dd 100%)`,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          {paymentStatus ? `Payment ${paymentStatus}` : "ProFinder Payment"}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            py: 3,
          }}
        >
          <Box my={3}>
            {getStatusIcon()}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
              {error}
            </Alert>
          )}

          <Typography variant="body1" color="textSecondary" sx={{ maxWidth: 400, mb: 3 }}>
            {getStatusMessage()}
          </Typography>

          {!paymentStatus && (
            <Paper
              elevation={3}
              sx={{
                px: 4,
                py: 2,
                borderRadius: 3,
                backgroundColor: "#fff",
                mb: 3,
                width: '100%',
                maxWidth: 400
              }}
            >
              <Typography variant="h6" fontWeight="bold">
                ProFinder Verification Fee
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                Secure payment of ₹{(amount / 100).toFixed(2)} via Razorpay
              </Typography>

              <Box mt={2}>
                <Button
                  variant="contained"
                  onClick={handlePayment}
                  disabled={loading}
                  sx={{
                    backgroundColor: "#00C853",
                    color: "#fff",
                    fontWeight: "bold",
                    px: 4,
                    py: 1,
                    "&:hover": {
                      backgroundColor: "#00b94d",
                    },
                    "&:disabled": {
                      backgroundColor: "#ccc",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    `Pay ₹${(amount / 100).toFixed(2)}`
                  )}
                </Button>
              </Box>
            </Paper>
          )}

          {paymentStatus && (
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ width: '100%' }}>
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography variant="body2" color="textSecondary">
                      {step.description}
                    </Typography>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          )}

                     <Typography variant="caption" color="textSecondary" sx={{ mt: 2 }}>
             Secured by <strong>Razorpay</strong>
           </Typography>

           {/* Payment History Section */}
           {showPaymentHistory && (
             <Box sx={{ mt: 3, width: '100%' }}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                 <Typography variant="h6" fontWeight="bold">
                   Payment History
                 </Typography>
                 <Button 
                   variant="outlined" 
                   size="small"
                   onClick={() => {
                     console.log('Test payment detail');
                     if (payments.length > 0) {
                       handlePaymentClick(payments[0]);
                     }
                   }}
                 >
                   Test Detail
                 </Button>
               </Box>
               {loadingPayments ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                   <CircularProgress />
                 </Box>
               ) : payments.length > 0 ? (
                                   <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                    {payments.map((payment) => {
                      console.log('Rendering payment:', payment);
                      return (
                      <Paper 
                        key={payment._id} 
                        sx={{ 
                          p: 2, 
                          mb: 1, 
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(0,0,0,0.05)',
                            transform: 'translateY(-1px)',
                            transition: 'all 0.2s ease'
                          },
                          '&:active': {
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            transform: 'translateY(0px)'
                          }
                        }}
                        onClick={() => {
                          console.log('Paper clicked for payment:', payment._id);
                          handlePaymentClick(payment);
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold">
                              ₹{payment.amount}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={payment.paymentStatus}
                            color={payment.paymentStatus === 'Success' ? 'success' : 
                                   payment.paymentStatus === 'Failed' ? 'error' : 'default'}
                            size="small"
                          />
                        </Box>
                        <Typography variant="caption" fontFamily="monospace" sx={{ mt: 1, display: 'block' }}>
                          {payment.razorpayPaymentId}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Click to view details
                        </Typography>
                      </Paper>
                    );
                    })}
                  </Box>
               ) : (
                 <Typography variant="body2" color="textSecondary" textAlign="center">
                   No payment history found
                 </Typography>
               )}
             </Box>
           )}
         </Box>
       </DialogContent>

       <DialogActions sx={{ p: 2 }}>
         <Button onClick={onClose} color="primary">
           Close
         </Button>
       </DialogActions>
     </Dialog>

     {/* Payment Detail Dialog */}
     <Dialog
       open={paymentDetailOpen}
       onClose={handleClosePaymentDetail}
       onOpen={() => console.log('Payment detail dialog opened')}
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
         <Typography variant="h6" fontWeight="bold">
           Payment Details
         </Typography>
       </DialogTitle>

       <DialogContent sx={{ p: 3 }}>
         {selectedPayment && (
           <Box>
             {/* Payment Status Header */}
             <Box sx={{ 
               display: 'flex', 
               alignItems: 'center', 
               gap: 2, 
               mb: 3,
               p: 2,
               borderRadius: 2,
               backgroundColor: selectedPayment.paymentStatus === 'Success' ? 'success.light' :
                              selectedPayment.paymentStatus === 'Failed' ? 'error.light' :
                              selectedPayment.paymentStatus === 'Pending' ? 'warning.light' : 'grey.100'
             }}>
               <Chip
                 label={selectedPayment.paymentStatus}
                 color={selectedPayment.paymentStatus === 'Success' ? 'success' : 
                        selectedPayment.paymentStatus === 'Failed' ? 'error' : 'default'}
                 size="medium"
               />
               <Typography variant="h6" fontWeight="bold">
                 ₹{selectedPayment.amount}
               </Typography>
             </Box>

             {/* Payment Information Grid */}
             <Grid container spacing={3}>
               <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                   Payment Information
                 </Typography>
                 <Paper sx={{ p: 2, mb: 2 }}>
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" color="text.secondary">
                       Payment ID
                     </Typography>
                     <Typography variant="body2" fontFamily="monospace">
                       {selectedPayment.razorpayPaymentId}
                     </Typography>
                   </Box>
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" color="text.secondary">
                       Order ID
                     </Typography>
                     <Typography variant="body2" fontFamily="monospace">
                       {selectedPayment.razorpayOrderId || 'N/A'}
                     </Typography>
                   </Box>
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" color="text.secondary">
                       Payment Method
                     </Typography>
                     <Typography variant="body2">
                       {selectedPayment.paymentMethod}
                     </Typography>
                   </Box>
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" color="text.secondary">
                       Payment Type
                     </Typography>
                     <Typography variant="body2">
                       {selectedPayment.paymentType}
                     </Typography>
                   </Box>
                   <Box>
                     <Typography variant="caption" color="text.secondary">
                       Date & Time
                     </Typography>
                     <Typography variant="body2">
                       {new Date(selectedPayment.createdAt).toLocaleString('en-IN')}
                     </Typography>
                   </Box>
                 </Paper>
               </Grid>

               <Grid item xs={12} md={6}>
                 <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                   Service Details
                 </Typography>
                 <Paper sx={{ p: 2, mb: 2 }}>
                   <Box sx={{ mb: 2 }}>
                     <Typography variant="caption" color="text.secondary">
                       Description
                     </Typography>
                     <Typography variant="body2">
                       {selectedPayment.description}
                     </Typography>
                   </Box>
                   {selectedPayment.adminId && (
                     <Box sx={{ mb: 2 }}>
                       <Typography variant="caption" color="text.secondary">
                         Professional
                       </Typography>
                       <Typography variant="body2">
                         {selectedPayment.adminId.profession || 'N/A'}
                       </Typography>
                     </Box>
                   )}
                   {selectedPayment.requestId && (
                     <Box sx={{ mb: 2 }}>
                       <Typography variant="caption" color="text.secondary">
                         Request Title
                       </Typography>
                       <Typography variant="body2">
                         {selectedPayment.requestId.title || 'N/A'}
                       </Typography>
                     </Box>
                   )}
                   {selectedPayment.requestId && (
                     <Box>
                       <Typography variant="caption" color="text.secondary">
                         Request Status
                       </Typography>
                       <Typography variant="body2">
                         {selectedPayment.requestId.status || 'N/A'}
                       </Typography>
                     </Box>
                   )}
                 </Paper>
               </Grid>

               {/* Failure Reason (if failed) */}
               {selectedPayment.failureReason && (
                 <Grid item xs={12}>
                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                     Failure Details
                   </Typography>
                   <Paper sx={{ p: 2, backgroundColor: 'error.light' }}>
                     <Typography variant="body2" color="error">
                       {selectedPayment.failureReason}
                     </Typography>
                   </Paper>
                 </Grid>
               )}

               {/* Metadata Information */}
               {selectedPayment.metadata && Object.keys(selectedPayment.metadata).length > 0 && (
                 <Grid item xs={12}>
                   <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                     Additional Information
                   </Typography>
                   <Paper sx={{ p: 2 }}>
                     <Typography variant="body2" fontFamily="monospace" fontSize="0.8rem">
                       {JSON.stringify(selectedPayment.metadata, null, 2)}
                     </Typography>
                   </Paper>
                 </Grid>
               )}
             </Grid>
           </Box>
         )}
       </DialogContent>

       <DialogActions sx={{ p: 2 }}>
         <Button onClick={handleClosePaymentDetail} color="primary">
           Close
         </Button>
       </DialogActions>
     </Dialog>
    </>
  );
 };

export default ComprehensivePaymentHandler; 