import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Avatar,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PaymentHistoryCard = ({ record }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    const onlyDate = dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const onlyTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return { onlyDate, onlyTime };
  };

  const { onlyDate, onlyTime } = formatDateTime(record.paymentDate);
  const adminName = record.adminName || 'Unknown Admin';
  const adminProfession = record.adminDetails?.profession || "";
  const profilePhoto = record.adminDetails?.profilePhoto || "";

  return (
    <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3, overflow: 'visible' }}>
      <CardContent sx={{ p: 2 }}>
        {/* Header with Admin Avatar and Name */}
        <Grid container sx={{justifyContent:"space-between" }} spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={profilePhoto} alt={adminName} sx={{ width: 56, height: 56 }}>
              {adminName.charAt(0)}
            </Avatar>
          </Grid>
          <Grid  item xs>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: 'inline-block'
              }}
            >
              {adminName}
            </Typography>
            {adminProfession && (
              <Typography variant="body2">
                {adminProfession}
              </Typography>
            )}
          </Grid>
          <Grid item>
            <Chip
              label={record.status === "success" ? "Paid" : "Failed"}
              color={record.status === "success" ? "success" : "error"}
              size="medium"
              sx={{ fontWeight: 'bold', px: 2 }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Payment Details */}
        <Grid container spacing={isMobile ? 1 : 3}>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary">Service Type</Typography>
            <Typography variant="body2" fontWeight="medium">
              {record.serviceType ? record.serviceType + " Payment" : "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary">Amount</Typography>
            <Typography variant="body2" fontWeight="medium">₹{record.amount ? record.amount.toFixed(2) : "0.00"}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary">Payment ID</Typography>
            <Typography variant="body2" fontWeight="medium">{record.razorpayPaymentId || "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Typography variant="caption" color="text.secondary">Request ID</Typography>
            <Typography variant="body2" fontWeight="medium" sx={{ fontFamily: "monospace" }}>
              {record.razorpayOrderId || "-"}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Payment Date</Typography>
            <Typography variant="body2" fontWeight="medium">
              {onlyDate}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="caption" color="text.secondary">Payment Time</Typography>
            <Typography variant="body2" fontWeight="medium">
              {onlyTime}
            </Typography>
          </Grid>
        </Grid>

        {record.status === "failed" && record.error && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="error">
              Payment failed: {record.error}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;