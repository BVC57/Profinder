const PendingAdminsList = () => {
    if (loading) {
      return (
        <Container sx={{ mt: 4 }}>
          <Typography variant="h6">Loading pending admins...</Typography>
        </Container>
      );
    }

    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Pending Admins for Verification</Typography>
      
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {pendingAdmins.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No pending admins found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Profession</strong></TableCell>
                  <TableCell><strong>Experience</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Identity Documents</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingAdmins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell>
                      <Typography variant="body1">
                        {admin.userId?.name || 'Unknown'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.profession}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.experience}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {admin.city}, {admin.pincode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {admin.aadharCard && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Aadhar Card" size="small" color="primary" />
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewImage(admin.aadharCard, 'Aadhar Card')}
                            >
                              View
                            </Button>
                          </Box>
                        )}
                        
                        {admin.voterId && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label="Voter ID" size="small" color="secondary" />
                            <Button
                              size="small"
                              startIcon={<Visibility />}
                              onClick={() => handleViewImage(admin.voterId, 'Voter ID')}
                            >
                              View
                            </Button>
                          </Box>
                        )}
                        
                        {!admin.aadharCard && !admin.voterId && (
                          <Typography variant="body2" color="error">
                            No documents uploaded
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="success"
                          startIcon={<Verified />}
                          onClick={() => verifyAdmin(admin._id)}
                          size="small"
                        >
                          Verify
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => {
                            setRejectDialogOpen(true);
                            setAdminToReject(admin._id);
                          }}
                          size="small"
                        >
                          Reject
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Image View Dialog */}
        <Dialog
          open={imageDialogOpen}
          onClose={handleCloseImageDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                {selectedImage?.type} Document
              </Typography>
              <IconButton onClick={handleCloseImageDialog}>
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedImage && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <img
                  src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${selectedImage.path}`}
                  alt={selectedImage.type}
                  style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Typography 
                  variant="body2" 
                  color="error" 
                  sx={{ display: 'none', textAlign: 'center', mt: 2 }}
                >
                  Failed to load image. Please check the file path.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseImageDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  };