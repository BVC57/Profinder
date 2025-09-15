import React from 'react'
import { Box, useMediaQuery, useTheme } from '@mui/material';
import AdminList from '../components/AdminList'
import VerifiedAdminList from '../components/VerifiedAdminList';
import Footer from '../components/Footer';


const HomePage = () => {
  return (
    <Box>
      <AdminList />
      {/* <VerifiedAdminList /> */}
      <Footer />
    </Box>
  )
}

export default HomePage