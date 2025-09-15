// Get current admin's subscription info (async/await, correct model)
exports.getSubscription = async (req, res) => {
  try {
    const AdminProfile = require('../models/AdminProfile');
    const adminProfile = await AdminProfile.findOne({ userId: req.user.id });
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Return subscription info in the same structure as before
    res.json({ subscription: adminProfile.subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upgrade to pro plan (simulate payment)
exports.upgradeToPro = async (req, res) => {
  try {
    const Admin = require('../models/AdminProfile');
    const admin = await Admin.findOne({ userId: req.user.id });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    if (admin.subscription.plan === 'pro') {
      return res.status(400).json({ message: 'Already on Pro plan' });
    }
    // Simulate payment success
    admin.subscription.plan = 'pro';
    admin.subscription.usage = 0;
    admin.subscription.renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    await admin.save();
    res.json({ message: 'Upgraded to Pro plan', subscription: admin.subscription });
  } catch (error) {
    console.error('Upgrade to pro error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
const AdminProfile = require("../models/AdminProfile");
const User = require("../models/User");

exports.submitAdminForm = async (req, res) => {
  try {
    const {
      profession,
      experience,
      city,
      pincode,
      mobile,
      email,
      latitude,
      longitude,
      gender,
      skills,
      specialization,
    } = req.body;
    

    

    // Handle uploaded files
    const aadharCard = req.files?.aadharCard
      ? req.files.aadharCard[0].filename
      : null;
    const voterId = req.files?.voterId ? req.files.voterId[0].filename : null;
    const profilePhoto = req.files?.profilePhoto
      ? req.files.profilePhoto[0].filename
      : null;

    // Validation
    if (!aadharCard && !voterId) {
      return res
        .status(400)
        .json({
          message:
            "Please upload at least one identity document (Aadhar Card or Voter ID)",
        });
    }

    const admin = new AdminProfile({
      userId: req.user.id,
      profession,
      skills: Array.isArray(skills) ? skills : JSON.parse(skills || "[]"),
      specializations: Array.isArray(specializations) ? specializations : JSON.parse(specializations || "[]"),
      experience,
      city,
      pincode,
      mobile,
      email,
      latitude,
      longitude,
      gender,
      profilePhoto,
      aadharCard,
      voterId,
    });

    await admin.save();

    // Optionally update User model
    await User.findByIdAndUpdate(req.user.id, {
      gender,
      profilePhoto,
    });

    res.json({ message: "Admin profile submitted successfully", admin });
  } catch (error) {
    console.error("Submit admin form error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getVerifiedAdmins = async (req, res) => {
  const { city, profession } = req.query;
  const admins = await AdminProfile.find({ city, profession, status: 'verified' }).populate('userId');
  res.json(admins);
};

// New function to update admin profile in User model
exports.updateAdminProfile = async (req, res) => {
  try {
    const { profession, experience, city, pincode, mobile, latitude, longitude } = req.body;
    
    // Validate required fields
    if (!profession || !experience || !city || !pincode || !mobile) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists and is an admin
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can update profile' });
    }

    // Update user profile with admin information
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profession,
        experience,
        city,
        pincode,
        mobile,
        latitude,
        longitude,
        verified: false // Reset verification status when profile is updated
      },
      { new: true, runValidators: true }
    );

    res.json({ 
      message: 'Admin profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profession: updatedUser.profession,
        experience: updatedUser.experience,
        city: updatedUser.city,
        pincode: updatedUser.pincode,
        mobile: updatedUser.mobile,
        latitude: updatedUser.latitude,
        longitude: updatedUser.longitude,
        verified: updatedUser.verified
      }
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current admin profile
exports.getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can access profile' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      profession: user.profession,
      experience: user.experience,
      city: user.city,
      pincode: user.pincode,
      mobile: user.mobile,
      latitude: user.latitude,
      longitude: user.longitude,
      verified: user.verified,
      aadharCard: user.aadharCard,
      voterId: user.voterId
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get admin profile by ID (super admin only)
exports.getAdminProfileById = async (req, res) => {
  try {
    const adminProfile = await AdminProfile.findById(req.params.id).populate('userId');
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    res.json(adminProfile);
  } catch (error) {
    console.error('Get admin profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update admin profile by ID (super admin only)
exports.updateAdminProfileById = async (req, res) => {
  try {
    const { profession, experience, city, pincode, mobile, email, status } = req.body;
    
    const adminProfile = await AdminProfile.findById(req.params.id);
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // Update admin profile
    const updatedProfile = await AdminProfile.findByIdAndUpdate(
      req.params.id,
      {
        profession,
        experience,
        city,
        pincode,
        mobile,
        email,
        status
      },
      { new: true, runValidators: true }
    );

    // Also update the user model if status is verified
    if (status === 'verified') {
      await User.findByIdAndUpdate(adminProfile.userId, {
        profession,
        experience,
        city,
        pincode,
        mobile,
        verified: true,
        role: 'admin'
      });
    }

    res.json({ 
      message: 'Admin profile updated successfully',
      profile: updatedProfile
    });

  } catch (error) {
    console.error('Update admin profile by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete admin profile (super admin only)
exports.deleteAdminProfile = async (req, res) => {
  try {
    const adminProfile = await AdminProfile.findById(req.params.id);
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    // Delete the admin profile
    await AdminProfile.findByIdAndDelete(req.params.id);

    // Update user role back to 'user' and remove admin fields
    await User.findByIdAndUpdate(adminProfile.userId, {
      role: 'user',
      profession: undefined,
      experience: undefined,
      city: undefined,
      pincode: undefined,
      mobile: undefined,
      verified: false,
      aadharCard: undefined,
      voterId: undefined
    });

    res.json({ message: 'Admin profile deleted successfully' });

  } catch (error) {
    console.error('Delete admin profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
