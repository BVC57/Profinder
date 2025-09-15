
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const superAdminController = require('../controllers/superAdminController');
const AdminProfile = require('../models/AdminProfile');
const User = require('../models/User');
const Payment = require('../models/PaymentSchema');
const UserRequest = require('../models/UserRequest');
const Notification = require('../models/Notification');

// Get all admin subscription plans and purchase details
router.get('/admin-subscriptions', auth, authorizeRoles('superadmin'), superAdminController.getAllAdminSubscriptions);

// Get new users joined in the last 7 days
router.get('/new-users', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.find({
      role: 'user',
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).select('-password');
    res.json(newUsers);
  } catch (error) {
    console.error('Error fetching new users:', error);
    res.status(500).json({ message: 'Error fetching new users' });
  }
});

// Debug route to check all admin profiles
router.get('/debug/all-profiles', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Debug - Fetching all admin profiles...');
    
    const allProfiles = await AdminProfile.find({}).populate('userId');
    console.log('All admin profiles:', allProfiles);
    
    res.json({
      totalProfiles: allProfiles.length,
      profiles: allProfiles
    });
  } catch (error) {
    console.error('Error fetching all profiles:', error);
    res.status(500).json({ message: 'Error fetching all profiles' });
  }
});

// Get pending admin requests
router.get('/pending', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Fetching pending admins...');
    console.log('User making request:', req.user);
    
    const pending = await AdminProfile.find({ status: 'pending' }).populate('userId');
    console.log('Found pending admins:', pending.length);
    console.log('Pending admins data:', pending);
    
    res.json(pending);
  } catch (error) {
    console.error('Error fetching pending admins:', error);
    res.status(500).json({ message: 'Error fetching pending admins' });
  }
});

// Approve admin request
router.post('/verify/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Verifying admin with ID:', req.params.id);
    
    const adminProfile = await AdminProfile.findById(req.params.id).populate('userId');
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    
    const result = await AdminProfile.findByIdAndUpdate(req.params.id, { status: 'verified' });
    console.log('Verification result:', result);
    
    // Update user role to admin
    await User.findByIdAndUpdate(adminProfile.userId._id, { 
      role: 'admin',
      verified: true
    });
    
    // Create notification for the admin
    const notification = new Notification({
      recipient: adminProfile.userId._id,
      sender: req.user.id,
      type: 'admin_verified',
      title: 'Admin Verification Approved',
      message: `Your admin verification request has been approved. You can now accept service requests.`,
      relatedAdminProfile: adminProfile._id
    });
    await notification.save();
    
    res.json({ message: 'Admin verified' });
  } catch (error) {
    console.error('Error verifying admin:', error);
    res.status(500).json({ message: 'Error verifying admin' });
  }
});


// Reject admin request
router.post('/reject/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Rejecting admin with ID:', req.params.id);
    
    const adminProfile = await AdminProfile.findById(req.params.id).populate('userId');
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }
    
    const result = await AdminProfile.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    console.log('Rejection result:', result);
    
    // Update user role back to user
    await User.findByIdAndUpdate(adminProfile.userId._id, { 
      role: 'user',
      verified: false
    });
    
    // Create notification for the admin
    const notification = new Notification({
      recipient: adminProfile.userId._id,
      sender: req.user.id,
      type: 'admin_rejected',
      title: 'Admin Verification Rejected',
      message: `Your admin verification request has been rejected. You can resubmit your application with updated information.`,
      relatedAdminProfile: adminProfile._id
    });
    await notification.save();
    
    res.json({ message: 'Admin request rejected' });
  } catch (error) {
    console.error('Error rejecting admin:', error);
    res.status(500).json({ message: 'Error rejecting admin' });
  }
});

// Dashboard statistics endpoint
router.get('/dashboard-stats', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Fetching dashboard statistics...');
    
    // Get total users
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    // Get total admins (all admin profiles)
    const totalAdmins = await AdminProfile.countDocuments();
    
    // Get verified admins
    const verifiedAdmins = await AdminProfile.countDocuments({ status: 'verified' });
    
    // Get pending admin requests
    const pendingAdmins = await AdminProfile.countDocuments({ status: 'pending' });
    
    const stats = {
      totalUsers,
      totalAdmins,
      verifiedAdmins,
      pendingAdmins
    };
    
    console.log('Dashboard stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard statistics' });
  }
});

// Get all users for detailed view
router.get('/users', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all admins for detailed view
router.get('/admins', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const admins = await AdminProfile.find({}).populate('userId', '-password');
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Error fetching admins' });
  }
});

// Get verified admins for detailed view
router.get('/verified-admins', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const verifiedAdmins = await AdminProfile.find({ status: 'verified' }).populate('userId', '-password');
    res.json(verifiedAdmins);
  } catch (error) {
    console.error('Error fetching verified admins:', error);
    res.status(500).json({ message: 'Error fetching verified admins' });
  }
});


// save all payments



// get all payments data

// @route   GET /api/payments/all
// @desc    Get all payments - Super Admin only
// @access  Private (Super Admin)
router.get('/allpayments',auth, authorizeRoles('superadmin'), async (req, res) => {
  console.log('SuperAdmin: Fetching all payments...');
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')  // populating user info if needed
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Fetched all payment records',
      payments,
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});


// Analytics endpoint for super admin
router.get('/analytics', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    console.log('SuperAdmin: Fetching analytics data...');
    
    // Get time range from query params
    const timeRange = req.query.timeRange || '30d';
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : timeRange === '1y' ? 365 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Platform Statistics
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalAdmins = await AdminProfile.countDocuments();
    const verifiedAdmins = await AdminProfile.countDocuments({ status: 'verified' });
    const pendingVerifications = await AdminProfile.countDocuments({ status: 'pending' });
    
    // Active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({ 
      role: 'user', 
      lastLoginAt: { $gte: thirtyDaysAgo } 
    });

    // New users this month
    const thisMonth = new Date();
    thisMonth.setMonth(thisMonth.getMonth() - 1);
    const newUsersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: thisMonth }
    });

    // Request Statistics
    const totalRequests = await UserRequest.countDocuments();
    const completedRequests = await UserRequest.countDocuments({ status: 'completed' });
    const pendingRequests = await UserRequest.countDocuments({ status: 'pending' });
    const cancelledRequests = await UserRequest.countDocuments({ status: 'cancelled' });
    
    const completionRate = totalRequests > 0 ? ((completedRequests / totalRequests) * 100).toFixed(1) : 0;

    // Monthly request trends (last 12 months)
    const monthlyRequests = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const count = await UserRequest.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd }
      });
      monthlyRequests.push(count);
    }

    // Earnings Report
    const totalEarnings = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const monthlyEarnings = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          createdAt: { $gte: thisMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Payment methods breakdown
    const paymentMethods = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$paymentMethod', count: { $sum: 1 } } }
    ]);

    // Monthly earnings breakdown (last 6 months)
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      
      const earnings = await Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: monthStart, $lt: monthEnd }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyBreakdown.push({
        month: monthNames[monthStart.getMonth()],
        earnings: earnings[0]?.total || 0
      });
    }

    // Performance Metrics
    const avgResponseTime = await UserRequest.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, avgTime: { $avg: { $subtract: ['$completedAt', '$createdAt'] } } } }
    ]);

    const responseTimeHours = avgResponseTime[0]?.avgTime ? 
      Math.round((avgResponseTime[0].avgTime / (1000 * 60 * 60)) * 10) / 10 : 0;

    // Calculate platform rating (average of all admin ratings)
    const adminRatings = await AdminProfile.aggregate([
      { $match: { rating: { $exists: true, $ne: null } } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const platformRating = adminRatings[0]?.avgRating ? 
      Math.round(adminRatings[0].avgRating * 10) / 10 : 4.5;

    const analyticsData = {
      platformStats: {
        totalUsers,
        totalAdmins: verifiedAdmins,
        totalRequests,
        totalEarnings: totalEarnings[0]?.total || 0,
        activeUsers,
        newUsersThisMonth,
        pendingVerifications,
        platformRating
      },
      requestStats: {
        totalRequests,
        completedRequests,
        pendingRequests,
        cancelledRequests,
        completionRate: parseFloat(completionRate),
        avgCompletionTime: `${responseTimeHours} hours`,
        monthlyRequests
      },
      earningsReport: {
        totalEarnings: totalEarnings[0]?.total || 0,
        monthlyEarnings: monthlyEarnings[0]?.total || 0,
        avgPerRequest: totalRequests > 0 ? Math.round((totalEarnings[0]?.total || 0) / totalRequests) : 0,
        topEarningMonth: monthlyBreakdown.reduce((max, month) => 
          month.earnings > max.earnings ? month : max, { earnings: 0 }).month,
        paymentMethods: paymentMethods.reduce((acc, method) => {
          acc[method._id] = Math.round((method.count / totalRequests) * 100);
          return acc;
        }, {}),
        monthlyBreakdown
      },
      performanceMetrics: {
        customerSatisfaction: platformRating,
        responseTime: `${responseTimeHours} hours`,
        completionRate: parseFloat(completionRate),
        repeatCustomers: Math.round(totalUsers * 0.15), // Estimate 15% repeat customers
        referralRate: Math.round(totalUsers * 0.08), // Estimate 8% referral rate
        qualityScore: Math.round(platformRating * 20) // Convert rating to percentage
      },
      profileAnalytics: {
        profileViews: Math.round(totalUsers * 2.5), // Estimate profile views
        profileViewsChange: 12.5,
        contactClicks: Math.round(totalUsers * 0.3), // Estimate contact clicks
        contactClicksChange: 8.2,
        rating: platformRating,
        totalReviews: Math.round(totalUsers * 0.2), // Estimate total reviews
        responseRate: parseFloat(completionRate),
        avgResponseTime: `${responseTimeHours} hours`
      }
    };

    console.log('Analytics data:', analyticsData);
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router;
