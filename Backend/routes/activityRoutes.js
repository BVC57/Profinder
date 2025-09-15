const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const Activity = require('../models/Activity');

// Get all activities (Super Admin only)
router.get('/', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      actionType,
      userId,
      adminId,
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (actionType) {
      filter.actionType = actionType;
    }
    
    if (userId) {
      filter.user = userId;
    }
    
    if (adminId) {
      filter.admin = adminId;
    }
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }
    
    if (search) {
      filter.$or = [
        { 'details.requestTitle': { $regex: search, $options: 'i' } },
        { 'details.adminName': { $regex: search, $options: 'i' } },
        { 'details.userName': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get activities with pagination
    const activities = await Activity.find(filter)
      .populate('user', 'name email role')
      .populate('admin', 'profession city')
      .populate('request', 'title status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Activity.countDocuments(filter);

    res.json({
      activities,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Error fetching activities' });
  }
});

// Get activity statistics (Super Admin only)
router.get('/stats', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.createdAt.$lte = new Date(endDate);
      }
    }

    // Get counts by action type
    const actionTypeStats = await Activity.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$actionType',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total activities
    const totalActivities = await Activity.countDocuments(filter);

    // Get recent activities (last 7 days)
    const lastWeekFilter = {
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    };
    const recentActivities = await Activity.countDocuments(lastWeekFilter);

    // Get top users by activity
    const topUsers = await Activity.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Populate user details for top users
    const User = require('../models/User');
    const populatedTopUsers = await User.populate(topUsers, {
      path: '_id',
      select: 'name email role'
    });

    res.json({
      totalActivities,
      recentActivities,
      actionTypeStats,
      topUsers: populatedTopUsers
    });
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    res.status(500).json({ message: 'Error fetching activity statistics' });
  }
});

// Get single activity details (Super Admin only)
router.get('/:activityId', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.activityId)
      .populate('user', 'name email role')
      .populate('admin', 'profession city')
      .populate('request', 'title description status timeline adminNotes');

    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ message: 'Error fetching activity' });
  }
});

module.exports = router; 