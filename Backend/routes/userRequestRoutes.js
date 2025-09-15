const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const UserRequest = require('../models/UserRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const AdminProfile = require('../models/AdminProfile');
const { logActivity } = require('../utils/activityLogger');

// Create a new request (User only)
router.post('/create', auth, authorizeRoles('user'), async (req, res) => {
  try {
    const { adminId, title, description, estimatedDays } = req.body;

    // Validate required fields
    if (!adminId || !title || !description || !estimatedDays) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if admin exists and is verified
    const admin = await AdminProfile.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Professional not found' });
    }

    if (admin.status !== 'verified') {
      return res.status(400).json({ message: 'Professional is not verified' });
    }

    // Create the request
    const request = new UserRequest({
      user: req.user.id,
      admin: adminId,
      title,
      description,
      timeline: { estimatedDays }
    });

    await request.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      actionType: 'request_created',
      description: `User created a new service request: "${title}"`,
      details: {
        requestTitle: title,
        adminName: admin.profession,
        userName: req.user.name,
        status: 'pending',
        timeline: { estimatedDays }
      },
      adminId: adminId,
      requestId: request._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Create notification for admin
    const adminUser = await User.findById(admin.userId);
    if (adminUser) {
      const notification = new Notification({
        recipient: adminUser._id,
        sender: req.user.id,
        type: 'user_request',
        title: 'New Service Request',
        message: `You have received a new service request: "${title}"`,
        relatedUserRequest: request._id
      });
      await notification.save();
    }

    // Note: Removed work-related notifications for super admin
    // Super admin will only receive admin verification request notifications

    // Populate the request with user and admin details
    await request.populate('user', 'name email');
    await request.populate('admin', 'name profession city');

    res.status(201).json({ 
      message: 'Request created successfully',
      request 
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Error creating request' });
  }
});

// Get user's requests (User only)
router.get('/user-requests', auth, authorizeRoles('user'), async (req, res) => {
  try {
    // Populate admin with profession, city, pincode, and also populate userId to get admin's name
    const requests = await UserRequest.find({ user: req.user.id })
      .populate({
        path: 'admin',
        select: 'profession city pincode userId',
        populate: { path: 'userId', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Get admin's requests (Admin only)
router.get('/admin-requests', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    // Find admin profile for the current user
    const adminProfile = await AdminProfile.findOne({ userId: req.user.id });
    console.log('Admin Profile:', adminProfile);
    if (!adminProfile) {
      return res.status(404).json({ message: 'Admin profile not found' });
    }

    const requests = await UserRequest.find({ admin: adminProfile._id })
      .populate('user', 'name email')
      .populate('admin', 'name profession city pincode')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching admin requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Get all requests (Super Admin only)
router.get('/all-requests', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const requests = await UserRequest.find()
      .populate('user', 'name email')
      .populate('admin', 'name profession city')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

// Admin response to request (approve/reject with timeline)
router.put('/admin-response/:requestId', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, adminNotes, startDate, endDate } = req.body;
    const { requestId } = req.params;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the request
    const request = await UserRequest.findById(requestId)
      .populate('user', 'name email')
      .populate('admin', 'name profession');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the admin owns this request
    const adminProfile = await AdminProfile.findOne({ userId: req.user.id });
    if (!adminProfile || request.admin._id.toString() !== adminProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this request' });
    }

    // Update request
    request.status = status;
    request.adminNotes = adminNotes;

    if (status === 'approved') {
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Start date and end date are required for approval' });
      }
      request.timeline.startDate = new Date(startDate);
      request.timeline.endDate = new Date(endDate);
    }

    await request.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      actionType: status === 'approved' ? 'request_approved' : 'request_rejected',
      description: `Admin ${status} request: "${request.title}"`,
      details: {
        requestTitle: request.title,
        adminName: request.admin.name,
        userName: request.user.name,
        status: status,
        notes: adminNotes,
        timeline: status === 'approved' ? {
          estimatedDays: request.timeline.estimatedDays,
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        } : request.timeline
      },
      adminId: adminProfile._id,
      requestId: request._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Create notification for user
    const notification = new Notification({
      recipient: request.user._id,
      sender: req.user.id,
      type: status === 'approved' ? 'request_approved' : 'request_rejected',
      title: status === 'approved' ? 'Request Approved' : 'Request Rejected',
      message: status === 'approved' 
        ? `Your request "${request.title}" has been approved. Work will start on ${new Date(startDate).toLocaleDateString()}`
        : `Your request "${request.title}" has been rejected. ${adminNotes || ''}`,
      relatedUserRequest: request._id
    });
    await notification.save();

    // Note: Removed work-related notifications for super admin
    // Super admin will only receive admin verification request notifications

    res.json({ 
      message: `Request ${status} successfully`,
      request 
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request' });
  }
});

// Update request status (Admin only - in_progress, completed)
router.put('/update-status/:requestId', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const { requestId } = req.params;

    // Validate status
    if (!['in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the request
    const request = await UserRequest.findById(requestId)
      .populate('user', 'name email')
      .populate('admin', 'name profession');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the admin owns this request
    const adminProfile = await AdminProfile.findOne({ userId: req.user.id });
    if (!adminProfile || request.admin._id.toString() !== adminProfile._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Check if request is approved before allowing status updates
    if (request.status !== 'approved' && status === 'in_progress') {
      return res.status(400).json({ message: 'Request must be approved before starting work' });
    }

    // If completing a request, check and update subscription usage
    if (status === 'completed') {
      // Fetch latest admin profile
      const adminDoc = await AdminProfile.findById(adminProfile._id);
      if (adminDoc.subscription.plan === 'trial') {
        if (adminDoc.subscription.usage >= 10) {
          return res.status(403).json({ message: 'Trial plan limit reached. Please upgrade to Pro to complete more requests.' });
        }
        adminDoc.subscription.usage = (adminDoc.subscription.usage || 0) + 1;
        // If just reached 10, optionally notify admin
        if (adminDoc.subscription.usage === 10) {
          // Optionally, send notification or email here
        }
        await adminDoc.save();
      } else if (adminDoc.subscription.plan === 'pro') {
        adminDoc.subscription.usage = (adminDoc.subscription.usage || 0) + 1;
        await adminDoc.save();
      }
    }

    // Update request
    request.status = status;
    if (adminNotes) {
      request.adminNotes = adminNotes;
    }
    await request.save();

    // Log activity
    await logActivity({
      userId: req.user.id,
      actionType: status === 'in_progress' ? 'request_in_progress' : 'request_completed',
      description: `Admin updated request status to ${status}: "${request.title}"`,
      details: {
        requestTitle: request.title,
        adminName: request.admin.name,
        userName: request.user.name,
        status: status,
        notes: adminNotes
      },
      adminId: adminProfile._id,
      requestId: request._id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Create notification for user
    const statusMessage = status === 'in_progress' 
      ? 'Work has started on your request'
      : 'Work has been completed on your request';

    const notification = new Notification({
      recipient: request.user._id,
      sender: req.user.id,
      type: 'request_status_updated',
      title: status === 'in_progress' ? 'Work Started' : 'Work Completed',
      message: `${statusMessage}: "${request.title}"`,
      relatedUserRequest: request._id
    });
    await notification.save();

    // Note: Removed work-related notifications for super admin
    // Super admin will only receive admin verification request notifications

    res.json({ 
      message: `Request status updated to ${status}`,
      request 
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ message: 'Error updating request status' });
  }
});

// Admin rates user
router.post('/:requestId/rate-user', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const { stars, feedback } = req.body;
    const { requestId } = req.params;
    if (!stars) return res.status(400).json({ message: 'Stars required' });

    const request = await UserRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only allow if completed and not already rated
    if (request.status !== 'completed') return res.status(400).json({ message: 'Request not completed' });
    if (request.adminRating && request.adminRating.stars) return res.status(400).json({ message: 'Already rated' });

    request.adminRating = { stars, feedback };
    await request.save();

    res.json({ message: 'User rated successfully', adminRating: request.adminRating });
  } catch (err) {
    res.status(500).json({ message: 'Error rating user' });
  }
});

// User rates admin
router.post('/:requestId/rate-admin', auth, authorizeRoles('user'), async (req, res) => {
  try {
    const { stars, feedback } = req.body;
    const { requestId } = req.params;
    if (!stars) return res.status(400).json({ message: 'Stars required' });

    const request = await UserRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Only allow if completed and not already rated
    if (request.status !== 'completed') return res.status(400).json({ message: 'Request not completed' });
    if (request.userRating && request.userRating.stars) return res.status(400).json({ message: 'Already rated' });

    request.userRating = { stars, feedback };
    await request.save();

    res.json({ message: 'Admin rated successfully', userRating: request.userRating });
  } catch (err) {
    res.status(500).json({ message: 'Error rating admin' });
  }
});

// Get single request details
router.get('/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await UserRequest.findById(requestId)
      .populate('user', 'name email')
      .populate('admin', 'name profession city pincode');

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check authorization
    const adminProfile = await AdminProfile.findOne({ user: req.user.id });
    const isOwner = request.user._id.toString() === req.user.id;
    const isAdmin = adminProfile && request.admin._id.toString() === adminProfile._id.toString();
    const isSuperAdmin = req.user.role === 'superadmin';

    if (!isOwner && !isAdmin && !isSuperAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this request' });
    }

    res.json(request);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ message: 'Error fetching request' });
  }
});

// Get average userRating for an admin
router.get('/admin/:adminId/average-rating', async (req, res) => {
  try {
    const { adminId } = req.params;
    const requests = await UserRequest.find({ admin: adminId, 'userRating.stars': { $exists: true } });
    if (!requests.length) return res.json({ average: 0, count: 0 });
    const total = requests.reduce((sum, req) => sum + (req.userRating.stars || 0), 0);
    const average = total / requests.length;
    res.json({ average, count: requests.length });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching average rating' });
  }
});

module.exports = router; 