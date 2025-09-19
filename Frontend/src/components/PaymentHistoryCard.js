import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Alert,
} from "@mui/material";

const PaymentHistoryCard = ({ record }) => {
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

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {record.adminName} - {record.adminProfession}
            </Typography>
          </Box>
          <Chip
            label={record.status === "success" ? "Paid" : "Failed"}
            color={record.status === "success" ? "success" : "error"}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} alignItems="center">
          {/* Service Type */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Service Type
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {record.serviceType} Payment
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />

          {/* Amount */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ₹{record.amount ? record.amount.toFixed(2) : "0.00"}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />

          {/* Payment ID */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              PaymentId
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {record.razorpayPaymentId || "-"}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />

          {/* Request ID */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Request ID
            </Typography>
            <Typography
              variant="body1"
              fontWeight="medium"
              sx={{ fontFamily: "monospace" }}
            >
              {record.razorpayOrderId || "-"}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />

          {/* Payment Date */}
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              Payment Date&Time
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {onlyDate} {onlyTime}
            </Typography>
          </Grid>
          <Divider orientation="vertical" flexItem />
        </Grid>

        {record.status === "failed" && record.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Payment failed: {record.error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;
