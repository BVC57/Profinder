import React, { useState } from "react";
import { Box, Typography, Button, Paper, Alert, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingIcon from "@mui/icons-material/Pending";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const PaymentRequestPage = ({ 
  onSuccess, 
  onFailure, 
  onPending,
  adminId = null,
  requestId = null,
  amount = 500,
  description = "Service Request Payment",
  paymentType = "ServiceRequest",
  loading: externalLoading = false,
  buttonText = null
}) => {
  const userId = localStorage.getItem("userId") || "defaultUserId";
  const razorpayCheckoutId = localStorage.getItem("rzp_stored_checkout_id") || "N/A";
  const navigate = useNavigate();
  
  // Debug logging for adminId
  console.log('RazorpayButton - adminId received:', adminId);
  console.log('RazorpayButton - requestId received:', requestId);
  
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    setPaymentStatus(null);

    const res = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      setError("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

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

        try {
          // Save successful payment
          const paymentData = {
            userId: userId,
            adminId: adminId || null,
            requestId: requestId || null,
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
              checkoutId: razorpayCheckoutId
            },
            paymentDate: new Date().toISOString(),
          };

          const savedPayment = await savePaymentDetails(paymentData);
          
          if (onSuccess) {
            onSuccess(savedPayment);
            navigate('/requests');
          } else {
            alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
            window.location.href = "/";
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
            adminId: adminId || null,
            requestId: requestId || null,
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
              checkoutId: razorpayCheckoutId
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

        // Save failed payment
        const paymentData = {
          userId: userId,
          adminId: adminId || null,
          requestId: requestId || null,
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
            errorReason: resp.error.reason
          },
          paymentDate: new Date().toISOString(),
        };

        savePaymentDetails(paymentData).catch(console.error);

        if (onFailure) {
          onFailure(resp.error);
        } else {
          alert("Payment failed: " + (resp.error.description || "Unknown error"));
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
        return <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "white" }} />;
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

  return (
    <Box
      sx={{
        bgcolor: paymentStatus === "Failed" ? "#f44336" : paymentStatus === "Pending" ? "#ff9800" : "#00C853",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 2,
        borderRadius: 2,
      }}
    >
      <Box my={3}>
        {getStatusIcon()}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 400 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body1" color="white" sx={{ maxWidth: 400, mb: 3 }}>
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
              disabled={loading || externalLoading}
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
              {loading || externalLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                buttonText || `Pay ₹${(amount / 100).toFixed(2)}`
              )}
            </Button>
          </Box>
        </Paper>
      )}

      <Typography variant="caption" color="white">
        Secured by <strong>Razorpay</strong>
      </Typography>
    </Box>
  );
};

export default PaymentRequestPage;
