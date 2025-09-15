import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Tooltip,
  Checkbox,
  FormControlLabel,
  Snackbar
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from '../../api/axios';

const ContactSubmissionsPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
    sendEmail: false
  });
  const [snackbarMessage, setSnackbarMessage] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/contact/submissions');
      setSubmissions(response.data.submissions);
    } catch (err) {
      console.error('Error fetching contact submissions:', err);
      setError(err.response?.data?.message || 'Failed to fetch contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setViewDialogOpen(true);
  };

  const handleEditSubmission = (submission) => {
    setSelectedSubmission(submission);
    setEditForm({
      status: submission.status,
      notes: submission.notes || '',
      sendEmail: false
    });
    setEditDialogOpen(true);
  };

  const handleDeleteSubmission = (submission) => {
    setSelectedSubmission(submission);
    setDeleteDialogOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitEditForm = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/contact/submissions/${selectedSubmission._id}`, {
        status: editForm.status,
        notes: editForm.notes,
        sendEmail: editForm.sendEmail
      });
      fetchSubmissions();
      setEditDialogOpen(false);
      
      if (editForm.sendEmail) {
        setError(null);
        // Show success message for email
        setSnackbarMessage({
          open: true,
          message: `Status updated and email sent to ${selectedSubmission.email}`,
          severity: 'success'
        });
      } else {
        setSnackbarMessage({
          open: true,
          message: 'Status updated successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error updating submission:', err);
      setError(err.response?.data?.message || 'Failed to update submission');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/contact/submissions/${selectedSubmission._id}`);
      fetchSubmissions();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting submission:', err);
      setError(err.response?.data?.message || 'Failed to delete submission');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      new: { color: 'info', label: 'New' },
      read: { color: 'primary', label: 'Read' },
      replied: { color: 'success', label: 'Replied' },
      resolved: { color: 'success', label: 'Resolved' },
      spam: { color: 'error', label: 'Spam' }
    };
    const config = statusConfig[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading && submissions.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Contact Form Submissions
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchSubmissions}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {submissions.length === 0 ? (
        <Alert severity="info">
          No contact form submissions found.
        </Alert>
      ) : (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Subject</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((submission) => (
                    <TableRow hover key={submission._id}>
                      <TableCell>{submission.name}</TableCell>
                      <TableCell>{submission.email}</TableCell>
                      <TableCell>
                        {submission.subject.length > 30
                          ? `${submission.subject.substring(0, 30)}...`
                          : submission.subject}
                      </TableCell>
                      <TableCell>{formatDate(submission.createdAt)}</TableCell>
                      <TableCell>{getStatusChip(submission.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewSubmission(submission)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Status">
                            <IconButton
                              size="small"
                              color="secondary"
                              onClick={() => handleEditSubmission(submission)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteSubmission(submission)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={submissions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* View Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Contact Form Submission Details
            <IconButton onClick={() => setViewDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedSubmission.subject}</Typography>
                {getStatusChip(selectedSubmission.status)}
              </Box>
              
              <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">From</Typography>
                  <Typography variant="body1">{selectedSubmission.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{selectedSubmission.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Submitted On</Typography>
                  <Typography variant="body1">{formatDate(selectedSubmission.createdAt)}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body1">{formatDate(selectedSubmission.updatedAt)}</Typography>
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary">Message</Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedSubmission.message}
                  </Typography>
                </Paper>
              </Box>
              
              {selectedSubmission.notes && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary">Admin Notes</Typography>
                  <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'background.default' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {selectedSubmission.notes}
                    </Typography>
                  </Paper>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEditSubmission(selectedSubmission);
                  }}
                >
                  Update Status
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleDeleteSubmission(selectedSubmission);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Update Submission Status
        </DialogTitle>
        <DialogContent dividers>
          {selectedSubmission && (
            <Box sx={{ p: 1 }}>
              <TextField
                select
                label="Status"
                name="status"
                value={editForm.status}
                onChange={handleEditFormChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="read">Read</MenuItem>
                <MenuItem value="replied">Replied</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                <MenuItem value="spam">Spam</MenuItem>
              </TextField>
              
              <TextField
                label="Admin Notes"
                name="notes"
                value={editForm.notes}
                onChange={handleEditFormChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                helperText="These notes will be included in the email if you choose to send one"
              />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editForm.sendEmail}
                      onChange={(e) => setEditForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
                      name="sendEmail"
                      color="primary"
                    />
                  }
                  label="Send status update email to user"
                />  
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={submitEditForm} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this contact submission? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarMessage.open}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarMessage(prev => ({ ...prev, open: false }))} 
          severity={snackbarMessage.severity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ContactSubmissionsPanel;