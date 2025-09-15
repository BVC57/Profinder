// 📁 server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const config = require('../config');
const User = require('../models/User');
const authController = require("../controllers/authController");

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log(req.body)
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role });
  await user.save();
  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, config.JWT_SECRET);
  res.json({ token, user });
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Forgot password request received for email:', email);
    
    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email address' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create email transporter using the same configuration as authController
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chauhanbhadresh57@gmail.com',
        pass: 'zpqw mfng zvxd jxhw'
      }
    });

    // Verify email transporter configuration
    console.log('Verifying email transporter...');
    try {
      await transporter.verify();
      console.log('Email transporter verified successfully');
    } catch (verifyError) {
      console.error('Email transporter verification failed:', verifyError);
      throw new Error(`Email configuration error: ${verifyError.message}`);
    }

    // Email content
    console.log('Config FRONTEND_URL:', config.FRONTEND_URL);
    const resetUrl = `${config.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log('Generated reset URL:', resetUrl);
    const mailOptions = {
      from: 'chauhanbhadresh57@gmail.com',
      to: email,
      subject: '🔐 Profinder - Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profinder Password Reset</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 16px;
            }
            .content {
              padding: 40px 30px;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            .info-box {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
              <p>Profinder - Professional Services Platform</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>We received a request to reset your password for your Profinder account.</p>
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              
              <div class="info-box">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>For security reasons, this link can only be used once</li>
                </ul>
              </div>
              
              <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Profinder. Please do not reply to this email.</p>
              <p>&copy; 2024 Profinder. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    console.log('Attempting to send email to:', email);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error details:', {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      response: error.response,
      stack: error.stack
    });
    
    let errorMessage = 'Error sending reset email. Please try again.';
    
    // Provide more specific error messages
    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed. Please check email configuration.';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Unable to connect to email server. Please check internet connection.';
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = 'Email server connection timed out. Please try again.';
    } else if (error.responseCode === 535) {
      errorMessage = 'Email authentication failed. Please check email credentials.';
    } else if (error.responseCode === 550) {
      errorMessage = 'Email address not found or access denied.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: error.message,
      code: error.code 
    });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Error resetting password. Please try again.' });
  }
});



router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;