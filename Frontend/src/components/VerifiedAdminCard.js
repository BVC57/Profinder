import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

const VerifiedAdminCard = ({ admin }) => {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {admin.userId?.name}
        </Typography>
        <Typography>
          Profession: {admin.profession}
        </Typography>
        <Typography>
          Experience: {admin.experience}
        </Typography>
        <Typography>
          Location: {admin.city}, {admin.pincode}
        </Typography>
        <Box mt={2}>
          <Chip label="✅ Verified" color="success" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default VerifiedAdminCard;
