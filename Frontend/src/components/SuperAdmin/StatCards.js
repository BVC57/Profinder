import React from 'react';
import { Grid } from '@mui/material';
import {
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VerifiedUser as VerifiedIcon,
  PendingActions as PendingIcon
} from '@mui/icons-material';
import StatCard from '../StatCard';

const StatCards = ({ stats, loading, handleCardClick }) => (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Total Users"
        value={stats.totalUsers}
        icon={<PeopleIcon sx={{ color: '#2196F3' }} />}
        color="#2196F3"
        onClick={() => handleCardClick('users')}
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Total Admins"
        value={stats.totalAdmins}
        icon={<AdminIcon sx={{ color: '#FF9800' }} />}
        color="#FF9800"
        onClick={() => handleCardClick('admins')}
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Verified Admins"
        value={stats.verifiedAdmins}
        icon={<VerifiedIcon sx={{ color: '#4CAF50' }} />}
        color="#4CAF50"
        onClick={() => handleCardClick('verified')}
        loading={loading}
      />
    </Grid>
    <Grid item xs={12} sm={6} md={3}>
      <StatCard
        title="Pending Requests"
        value={stats.pendingAdmins}
        icon={<PendingIcon sx={{ color: '#F44336' }} />}
        color="#F44336"
        onClick={() => handleCardClick('pending')}
        loading={loading}
      />
    </Grid>
  </Grid>
);

export default StatCards; 