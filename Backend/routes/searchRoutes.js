// 📁 server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const AdminProfile = require('../models/AdminProfile');
const User = require('../models/User');

// Debug route to check all verified admin profiles
router.get('/debug/verified', async (req, res) => {
  try {
    const verifiedProfiles = await AdminProfile.find({ status: 'verified' }).populate('userId', 'name email');
    res.json({
      totalVerified: verifiedProfiles.length,
      profiles: verifiedProfiles
    });
  } catch (error) {
    console.error('Debug error:', error);
    res.status(500).json({ message: 'Debug error', error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { city = '', profession = '' } = req.query;
    console.log('Search query:', { city, profession });

    const query = {
      status: 'verified'
    };

    if (city) query.city = new RegExp(city, 'i');
    if (profession) query.profession = new RegExp(profession, 'i');

    console.log('Final query:', query);

    const adminProfiles = await AdminProfile.find(query).populate('userId', 'name email');
    console.log('Found verified admin profiles:', adminProfiles.length);
    
    res.json(adminProfiles);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
