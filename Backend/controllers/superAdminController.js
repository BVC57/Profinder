// 📁 server/controllers/superAdminController.js
const AdminProfile = require('../models/AdminProfile');
const User = require('../models/User');
const Admin = require('../models/AdminModel');

// Get all admin subscription plans and purchase details for super admin dashboard
exports.getAllAdminSubscriptions = async (req, res) => {
  try {
    // Get all admins with their subscription info
    const admins = await Admin.find({}, 'userId profession city subscription').populate('userId', 'name email');
    res.json({ success: true, admins });
  } catch (error) {
    console.error('Error fetching admin subscriptions:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

exports.getPendingAdmins = async (req, res) => {
  const pending = await AdminProfile.find({ status: 'pending' }).populate('userId');
  res.json(pending);
};

exports.verifyAdmin = async (req, res) => {
  try {
    console.log('SuperAdmin: Verifying admin with ID:', req.params.id);
    
    // First, get the admin profile to extract user data
    const adminProfile = await AdminProfile.findById(req.params.id).populate('userId');
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // Update AdminProfile status to verified
    await AdminProfile.findByIdAndUpdate(req.params.id, { status: 'verified' });

    // Update User model with admin information and verified status
    await User.findByIdAndUpdate(adminProfile.userId._id, {
      profession: adminProfile.profession,
      experience: adminProfile.experience,
      city: adminProfile.city,
      pincode: adminProfile.pincode,
      verified: true,
      role: 'admin' // Ensure role is set to admin
    });

    // Upsert Admin document for subscription tracking
    await Admin.findOneAndUpdate(
      { userId: adminProfile.userId._id },
      {
        userId: adminProfile.userId._id,
        profession: adminProfile.profession,
        experience: adminProfile.experience,
        city: adminProfile.city,
        pincode: adminProfile.pincode,
        verified: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('Admin verification completed successfully');
    res.json({ message: 'Admin verified successfully' });
  } catch (error) {
    console.error('Error verifying admin:', error);
    res.status(500).json({ message: 'Error verifying admin' });
  }
};

// 📁 server/controllers/userController.js
exports.getProfile = async (req, res) => {
  res.json({ message: 'User profile route working', user: req.user });
};
