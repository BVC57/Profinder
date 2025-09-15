// 📁 server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { uploadSingle, handleUploadError } = require('../middleware/upload');
const User = require('../models/User');
const authController = require('../controllers/authController');

router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching current user profile for ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('Current user not found with ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('Current user found:', user.name);
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile (for all authenticated users) - NO VERIFICATION REQUIRED
router.put('/profile', auth, uploadSingle, handleUploadError, async (req, res) => {
  try {
    console.log('User profile update request from user ID:', req.user.id);
    const { name, email, city, pincode, mobile } = req.body;
    
    console.log('Update data:', { name, email, city, pincode, mobile });
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already taken by another user' });
    }

    const updateData = {
      name,
      email,
      city,
      pincode,
      mobile
    };

    // Handle profile photo upload
    if (req.file) {
      updateData.profilePhoto = req.file.filename;
      console.log('Profile photo uploaded:', req.file.filename);
    }

    console.log('Updating user with data:', updateData);
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated successfully for user:', user.name);
    res.json({ 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        city: user.city,
        pincode: user.pincode,
        mobile: user.mobile,
        profilePhoto: user.profilePhoto,
        role: user.role,
        verified: user.verified
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile' });
  }
});

// Get all users (super admin only)
router.get('/all', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user (super admin only)
router.put('/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { name, email, role, profession, experience, city, pincode, verified } = req.body;
    
    const updateData = {
      name,
      email,
      role,
      profession,
      experience,
      city,
      pincode,
      verified
    };

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user (super admin only)
router.delete('/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching user with ID:', req.params.id);
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.name);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get verified admins
router.get('/verified-admins', async (req, res) => {
  try {
    const users = await User.find({ role: 'admin', verified: true }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password (authenticated users)
router.post('/change-password', auth, authController.changePassword);

module.exports = router;