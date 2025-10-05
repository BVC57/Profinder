import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch('/api/payment-history');
      if (!response.ok) throw new Error('Failed to fetch payment history');
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN") + " " + date.toLocaleTimeString("en-IN", { hour12: true });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Admin</TableCell>
            <TableCell>Service Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Payment ID</TableCell>
            <TableCell>Order ID</TableCell>
            <TableCell>Date & Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((payment, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {payment.adminName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {payment.adminProfession}
                </Typography>
              </TableCell>
              <TableCell>{payment.serviceType}</TableCell>
              <TableCell>₹{payment.amount?.toFixed(2)}</TableCell>
              <TableCell>{payment.razorpayPaymentId || "-"}</TableCell>
              <TableCell>{payment.razorpayOrderId || "-"}</TableCell>
              <TableCell>{formatDateTime(payment.paymentDate)}</TableCell>
              <TableCell>
                <Chip
                  label={payment.status === "success" ? "Paid" : "Failed"}
                  color={payment.status === "success" ? "success" : "error"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentHistory;