// ...existing code...
// 📁 server/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

const User = require('../models/User');
const AdminProfile = require('../models/AdminProfile');
const Notification = require('../models/Notification');
const adminController = require('../controllers/adminController');

// Subscription plan endpoints
// Get current admin's subscription info
router.get('/subscription', auth, adminController.getSubscription);

// Upgrade to pro plan (simulate payment)
router.post('/subscribe', auth, adminController.upgradeToPro);
const Payment = require('../models/PaymentSchema');

router.post('/submit', auth, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    const { profession, experience, city, pincode, gender,mobile_number,address,state,skills, specializations } = req.body;

      // Ensure skills and specializations are always arrays
    if (typeof skills === "string") {
      try {
        skills = JSON.parse(skills); // if it's stringified array
      } catch {
        skills = skills.split(",").map(s => s.trim()); // fallback: comma separated
      }
    }

    if (typeof specializations === "string") {
      try {
        specializations = JSON.parse(specializations);
      } catch {
        specializations = specializations.split(",").map(s => s.trim());
      }
    }

    if (!profession || !experience || !city || !pincode) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get uploaded files
    const aadharCard = req.files.aadharCard ? req.files.aadharCard[0].filename : null;
    const voterId = req.files.voterId ? req.files.voterId[0].filename : null;
    const profilePhoto = req.files.profilePhoto ? req.files.profilePhoto[0].filename : null;

    // Check if admin profile already exists
    const existingProfile = await AdminProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      if (existingProfile.status === 'pending') {
        return res.status(400).json({ message: 'Admin profile already submitted and pending verification' });
      }
      if (existingProfile.status === 'verified') {
        return res.status(400).json({ message: 'Admin profile already verified' });
      }
      // If rejected, allow resubmission by updating the profile and setting status to pending
      existingProfile.profession = profession;
      existingProfile.experience = experience;
      existingProfile.city = city;
      existingProfile.pincode = pincode;
      if (aadharCard) existingProfile.aadharCard = aadharCard;
      if (voterId) existingProfile.voterId = voterId;
      if (profilePhoto) existingProfile.profilePhoto = profilePhoto;
      existingProfile.status = 'pending';
      await existingProfile.save();
      // Create notification for all super admins
      const superAdmins = await User.find({ role: 'superadmin' });
      for (const superAdmin of superAdmins) {
        const notification = new Notification({
          recipient: superAdmin._id,
          sender: req.user.id,
          type: 'admin_verification_request',
          title: 'New Admin Verification Request',
          message: `${user.name} has resubmitted an admin verification request for ${profession} profession after rejection.`,
          relatedAdminProfile: existingProfile._id
        });
        await notification.save();
      }
      // Send real-time notification via socket.io
      if (global.io) {
        global.io.to('superadmin').emit('new-admin-verification', {
          message: `${user.name} has resubmitted an admin verification request`,
          adminProfile: existingProfile._id
        });
      }
      return res.json({ message: 'Admin profile resubmitted and pending verification' });
    }

    // Validate that at least one identity document is uploaded
    if (!aadharCard && !voterId) {
      return res.status(400).json({ message: 'Please upload at least one identity document (Aadhar Card or Voter ID)' });
    }

    // Update user role to admin (pending verification)
    await User.findByIdAndUpdate(req.user.id, { 
      role: 'admin',
      aadharCard,
      voterId
    });

    // Create new admin profile
    const adminProfile = new AdminProfile({
      userId: req.user.id,
      profession,
      experience,
      gender,
      mobile_number,
      address,
      state,
      city,
      pincode,
      aadharCard,
      voterId,
      profilePhoto,
      status: 'pending',
      skills,
      specializations
    });
    await adminProfile.save();

    // Create notification for all super admins
    const superAdmins = await User.find({ role: 'superadmin' });
    
    for (const superAdmin of superAdmins) {
      const notification = new Notification({
        recipient: superAdmin._id,
        sender: req.user.id,
        type: 'admin_verification_request',
        title: 'New Admin Verification Request',
        message: `${user.name} has submitted an admin verification request for ${profession} profession.`,
        relatedAdminProfile: adminProfile._id
      });
      
      await notification.save();
    }

    // Send real-time notification via socket.io
    if (global.io) {
      global.io.to('superadmin').emit('new-admin-verification', {
        message: `${user.name} has submitted an admin verification request`,
        adminProfile: adminProfile._id
      });
    }

    res.json({ message: 'Admin profile submitted and pending for request verification' });

  } catch (error) {
    console.error('Admin profile submit error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get All Verified Admins
router.get('/verified', async (req, res) => {
  try {
    const admins = await AdminProfile.find({ status: 'verified' }).populate('userId', 'name email mobile profilePhoto gender').select('-subscription');
    
    // Map the data to include profile photo from User model
    const adminsWithPhotos = admins.map(admin => ({
      ...admin.toObject(),
      profilePhoto: admin.userId?.profilePhoto || admin.profilePhoto, // Get from User model first, fallback to AdminProfile
      name: admin.userId?.name || 'Unknown',
      email: admin.userId?.email || admin.email || '',
      mobile: admin.userId?.mobile || admin.mobile || '',
      gender: admin.userId?.gender || admin.gender || ''
    }));
    
    res.json(adminsWithPhotos);
  } catch (error) {
    console.error('Error fetching verified admins:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all admin profiles (super admin only)
router.get('/all-profiles', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const admins = await AdminProfile.find({}).populate('userId');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admin profiles:', error);
    res.status(500).json({ message: 'Error fetching admin profiles' });
  }
});

// Enhanced search route with flexible filtering
router.get('/search', async (req, res) => {
  try {
    const { city, profession, searchTerm, experience } = req.query;
    
    // Build search query
    let query = { status: 'verified' };
    
    // Add filters if provided
    if (city) {
      query.city = { $regex: city, $options: 'i' }; // Case-insensitive partial match
    }
    
    if (profession) {
      query.profession = { $regex: profession, $options: 'i' }; // Case-insensitive partial match
    }
    
    if (experience) {
      query.experience = { $gte: parseInt(experience) }; // Minimum experience years
    }
    
    // If searchTerm is provided, search across multiple fields
    if (searchTerm) {
      const admins = await AdminProfile.find(query).populate('userId', 'name email mobile profilePhoto gender');
      
      // Filter by search term across name, profession, and city
      const filteredAdmins = admins.filter(admin => {
        const name = admin.userId?.name || '';
        const profession = admin.profession || '';
        const city = admin.city || '';
        
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
               city.toLowerCase().includes(searchTerm.toLowerCase());
      });
      
      // Map the data to include profile photo from User model
      const adminsWithPhotos = filteredAdmins.map(admin => ({
        ...admin.toObject(),
        profilePhoto: admin.userId?.profilePhoto || admin.profilePhoto,
        name: admin.userId?.name || 'Unknown',
        email: admin.userId?.email || admin.email || '',
        mobile: admin.userId?.mobile || admin.mobile || '',
        gender: admin.userId?.gender || admin.gender || ''
      }));
      
      return res.json(adminsWithPhotos);
    }
    
    // If no searchTerm, just use the query filters
    const admins = await AdminProfile.find(query).populate('userId', 'name email mobile profilePhoto gender');
    
    // Map the data to include profile photo from User model
    const adminsWithPhotos = admins.map(admin => ({
      ...admin.toObject(),
      profilePhoto: admin.userId?.profilePhoto || admin.profilePhoto,
      name: admin.userId?.name || 'Unknown',
      email: admin.userId?.email || admin.email || '',
      mobile: admin.userId?.mobile || admin.mobile || '',
      gender: admin.userId?.gender || admin.gender || ''
    }));
    
    res.json(adminsWithPhotos);
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available professions and cities for filters
router.get('/filter-options', async (req, res) => {
  try {
    const verifiedAdmins = await AdminProfile.find({ status: 'verified' });
    
    // Extract unique professions and cities
    const professions = [...new Set(verifiedAdmins.map(admin => admin.profession))].filter(Boolean);
    const cities = [...new Set(verifiedAdmins.map(admin => admin.city))].filter(Boolean);
    
    res.json({
      professions: professions.sort(),
      cities: cities.sort()
    });
  } catch (error) {
    console.error('Filter options error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// save all payments with comprehensive status handling
router.post('/savepayments', async (req, res) => {
  console.log('Request body:', req.body);

  try {
    const {
      userId,
      adminId,
      requestId,
      amount,
      currency,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentMethod,
      paymentStatus,
      paymentType,
      description,
      failureReason,
      metadata,
      paymentDate,
    } = req.body;

    // Validate required fields
    if (!userId || !amount || !razorpayPaymentId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Create a Mongoose model instance with comprehensive data
    const payment = new Payment({
      userId,
      adminId,
      requestId,
      amount,
      currency: currency || 'INR',
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      paymentMethod: paymentMethod || 'Razorpay',
      paymentStatus: paymentStatus || 'Pending',
      paymentType: paymentType || 'ServiceRequest',
      description: description || 'Service Request Payment',
      failureReason,
      metadata: metadata || {},
      createdAt: paymentDate || new Date(),
    });

    // ✅ Save to DB
    await payment.save();

    console.log(`✅ Payment saved with status: ${payment.paymentStatus}`);

    res.status(201).json({ 
      success: true, 
      message: `Payment ${paymentStatus || 'Pending'} successfully`, 
      payment 
    });
  } catch (error) {
    console.error("❌ Payment save error:", error);
    res.status(500).json({ success: false, message: "Error saving payment", error });
  }
});

// Update payment status
router.put('/payments/:paymentId/status', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { paymentStatus, failureReason, refundAmount } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    payment.paymentStatus = paymentStatus;
    if (failureReason) payment.failureReason = failureReason;
    if (refundAmount) {
      payment.refundAmount = refundAmount;
      payment.refundDate = new Date();
    }

    await payment.save();

    res.status(200).json({ 
      success: true, 
      message: `Payment status updated to ${paymentStatus}`, 
      payment 
    });
  } catch (error) {
    console.error("❌ Payment status update error:", error);
    res.status(500).json({ success: false, message: "Error updating payment status", error });
  }
});

// Get payment by ID
router.get('/payments/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId)
      .populate('userId', 'name email')
      .populate('adminId', 'profession city')
      .populate('requestId', 'title description status');

    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    console.error("❌ Payment fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching payment", error });
  }
});

router.get('/payments/mine', auth, async (req, res) => {
  try {
    const Payment = require('../models/PaymentSchema');
    // Find payments where userId matches the current admin's user id
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching admin payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payments by user ID
router.get('/payments/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = require('mongoose');

    // validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // populate adminId -> (populate its userId for admin name/email), userId and requestId
    const payments = await Payment.find({ userId })
      .populate([
        { 
          path: 'adminId', 
          populate: { path: 'userId', select: 'name email profilePhoto' },
          select: 'profession city profilePhoto userId name email'
        },
        { path: 'userId', select: 'name email profilePhoto' },
        { path: 'requestId', select: 'title description status' }
      ])
      .sort({ createdAt: -1 })
      .lean();

    // normalize response: ensure adminName and adminDetails are available
    const normalized = payments.map(p => {
      const adminUser = p.adminId?.userId;
      const adminNameFromProfile = p.adminId?.name || adminUser?.name || p.adminName || null;
      const adminEmailFromProfile = adminUser?.email || p.adminEmail || null;

      return {
        ...p,
        adminName: adminNameFromProfile,
        adminEmail: adminEmailFromProfile,
        adminDetails: p.adminId || null, // full populated admin profile (may include userId)
        userDetails: p.userId || null,
      };
    });

    res.status(200).json({ success: true, payments: normalized });
  } catch (error) {
    console.error("❌ User payments fetch error:", error);
    res.status(500).json({ success: false, message: "Error fetching user payments", error });
  }
});



// New routes for admin profile management
router.put('/profile', auth, adminController.updateAdminProfile);
router.get('/profile', auth, adminController.getAdminProfile);

// CRUD operations for admin profiles (super admin only)
router.put('/profile/:id', auth, authorizeRoles('superadmin'), adminController.updateAdminProfileById);
router.delete('/profile/:id', auth, authorizeRoles('superadmin'), adminController.deleteAdminProfile);
router.get('/profile/:id', auth, authorizeRoles('superadmin'), adminController.getAdminProfileById);

module.exports = router;