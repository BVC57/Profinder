const Activity = require('../models/Activity');

/**
 * Log an activity for super admin monitoring
 * @param {Object} params - Activity parameters
 * @param {string} params.userId - User who performed the action
 * @param {string} params.actionType - Type of action performed
 * @param {string} params.description - Human readable description
 * @param {Object} params.details - Additional details about the action
 * @param {string} params.adminId - Admin involved (optional)
 * @param {string} params.requestId - Request involved (optional)
 * @param {string} params.ipAddress - IP address (optional)
 * @param {string} params.userAgent - User agent (optional)
 */
const logActivity = async (params) => {
  try {
    const {
      userId,
      actionType,
      description,
      details = {},
      adminId = null,
      requestId = null,
      ipAddress = null,
      userAgent = null
    } = params;

    const activity = new Activity({
      user: userId,
      admin: adminId,
      request: requestId,
      actionType,
      description,
      details,
      ipAddress,
      userAgent
    });

    await activity.save();
    console.log(`Activity logged: ${actionType} - ${description}`);
  } catch (error) {
    console.error('Error logging activity:', error);
    // Don't throw error to avoid breaking main functionality
  }
};

module.exports = { logActivity }; 