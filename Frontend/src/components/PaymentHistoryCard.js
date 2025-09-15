import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Alert,
} from '@mui/material';

const PaymentHistoryCard = ({ record }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              {record.adminName} - {record.adminProfession}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(record.paymentDate)}
            </Typography>
          </Box>
          <Chip
            label={record.status === 'success' ? 'Paid' : 'Failed'}
            color={record.status === 'success' ? 'success' : 'error'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Service Type
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {record.serviceType}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              ₹{record.amount ? record.amount.toFixed(2) : '0.00'}
            </Typography>
          </Grid>
          {record.requestId && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                Request ID
              </Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ fontFamily: 'monospace' }}>
                {record.requestId}
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">
              {record.description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Scheduled Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {record.preferredDate}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Scheduled Time
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {record.preferredTime}
            </Typography>
          </Grid>
        </Grid>

        {record.status === 'failed' && record.error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Payment failed: {record.error}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryCard;
