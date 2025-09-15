const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// GET /api/admin/search-verified
// Query params: state, district, village, profession, city, nearPlace, searchTerm
router.get('/search-verified', async (req, res) => {
  try {
    const { state, district, village, profession, city, nearPlace, searchTerm } = req.query;
    const query = { isVerified: true };

    if (state) query.state = state;
    if (district) query.district = district;
    if (village) query.village = village;
    if (profession) query.profession = profession;
    if (city) query.city = city;
    if (nearPlace) query.nearPlace = { $regex: nearPlace, $options: 'i' };
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { profession: { $regex: searchTerm, $options: 'i' } },
        { city: { $regex: searchTerm, $options: 'i' } },
        { state: { $regex: searchTerm, $options: 'i' } },
        { district: { $regex: searchTerm, $options: 'i' } },
        { village: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const admins = await Admin.find(query).populate('userId');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
