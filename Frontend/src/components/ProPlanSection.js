import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Chip, CircularProgress, Alert, Button, Grid, Dialog } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import axios from "../api/axios";
import ComprehensivePaymentHandler from "./ComprehensivePaymentHandler";

const ProPlanSection = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/admin/subscription")
      .then((res) => {
        setSubscription(res.data.subscription);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subscription info");
        setLoading(false);
      });
  }, []);


  // Open payment dialog
  const handleUpgrade = () => {
    setPaymentOpen(true);
  };

  // After payment success, call upgrade API
  const handlePaymentSuccess = async () => {
    setUpgrading(true);
    try {
      const res = await axios.post("/api/admin/subscribe");
      setSubscription(res.data.subscription);
      setPaymentOpen(false);
      setShowPaymentHistory(true);
    } catch (e) {
      setError("Upgrade failed");
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <StarIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Admin Subscription Plan
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {subscription?.plan === "pro"
                ? "You are on the Pro Plan. Enjoy unlimited features!"
                : "You are on the Trial Plan. Complete up to 10 user requests for free."}
            </Typography>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, borderRadius: 2, background: '#f5f5f5' }}>
                  <Typography variant="subtitle2">Current Plan</Typography>
                  <Chip label={subscription?.plan === "pro" ? "Pro" : "Trial"} color={subscription?.plan === "pro" ? "success" : "default"} />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 2, borderRadius: 2, background: '#f5f5f5' }}>
                  <Typography variant="subtitle2">Requests Left</Typography>
                  <Chip label={subscription?.plan === "pro" ? `${100 - (subscription?.usage || 0)} / 100` : `${10 - (subscription?.usage || 0)} / 10`} color="info" />
                </Paper>
              </Grid>
            </Grid>
            {subscription?.plan === "trial" && (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  size="large"
                  onClick={handleUpgrade}
                  disabled={upgrading}
                  sx={{ mt: 2 }}
                >
                  {upgrading ? "Upgrading..." : "Upgrade to Pro (₹100/month)"}
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={() => setShowPaymentHistory((v) => !v)}
                >
                  {showPaymentHistory ? "Hide Payment History" : "Show Payment History"}
                </Button>
                <ComprehensivePaymentHandler
                  open={paymentOpen}
                  onClose={() => setPaymentOpen(false)}
                  onSuccess={handlePaymentSuccess}
                  amount={10000} // ₹100 in paise
                  description=" to Pro Plan"
                  paymentType="ProPlan"
                  showPaymentHistory={false}
                />
              </>
            )}
            {subscription?.plan === "pro" && subscription?.renewalDate && (
              <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                Renewal Date: {new Date(subscription.renewalDate).toLocaleDateString()}
              </Typography>
            )}
            {/* Payment History Table */}
            {showPaymentHistory && (
              <Paper sx={{ mt: 3, p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>Payment History</Typography>
                <ComprehensivePaymentHandler
                  open={true}
                  onClose={() => setShowPaymentHistory(false)}
                  showPaymentHistory={true}
                  amount={0}
                  paymentType="ProPlanUpgrade"
                  description="Pro Plan Payment History"
                />
              </Paper>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default ProPlanSection;
