import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ admin }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/admin/${admin._id}`)}
      sx={{ cursor: 'pointer', borderRadius: 3, boxShadow: 3 }}
    >
      <CardContent>
        <Typography variant="h6">{admin.name}</Typography>
        <Typography>{admin.profession}</Typography>
        <Typography>📍 {admin.city}</Typography>
        <Box mt={1}>
          <Chip label="✅ Verified" color="success" />
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
