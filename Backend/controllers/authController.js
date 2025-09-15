
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, role, isVerified: false , isActive: true });
  await user.save();
  res.json({ message: 'User registered' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, config.JWT_SECRET);
  res.json({ token, user });
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// In-memory store for OTPs (only valid for runtime)
const otpStore = {};

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    
    user: 'chauhanbhadresh57@gmail.com',
    pass: 'zpqw mfng zvxd jxhw',

  },
});

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


// ✅ Send OTP (no DB)
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();

    await transporter.sendMail({
      from: 'chauhanbhadresh57@gmail.com',
      to: email,
      subject: '🔐 Profinder - Your Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Profinder Verification</title>
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
            .otp-box {
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
              padding: 25px;
              border-radius: 8px;
              text-align: center;
              margin: 30px 0;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 10px 0;
              font-family: 'Courier New', monospace;
            }
            .info-box {
              background: #f8f9fa;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 0 8px 8px 0;
            }
            .warning-box {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .footer {
              background: #f8f9fa;
              padding: 20px 30px;
              text-align: center;
              border-top: 1px solid #e9ecef;
            }
            .footer p {
              margin: 5px 0;
              color: #6c757d;
              font-size: 14px;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .security-note {
              background: #e8f5e8;
              border: 1px solid #c3e6c3;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              color: #155724;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔍 Profinder</div>
              <h1>Verification Code</h1>
              <p>Your trusted platform for finding verified professionals</p>
            </div>
            
            <div class="content">
              <p>Hello!</p>
              
              <p>Thank you for using <strong>Profinder</strong> - your trusted platform for finding verified professionals.</p>
              
              <div class="otp-box">
                <p style="margin: 0 0 10px 0; font-size: 16px;">Your verification code is:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Enter this code to complete your verification</p>
              </div>
              
              <div class="info-box">
                <strong>⏰ Important:</strong> This code will expire in <strong>5 minutes</strong> for security purposes.
              </div>
              
              <div class="security-note">
                <strong>🔒 Security Notice:</strong> If you didn't request this verification code, please ignore this email and consider changing your password.
              </div>
              
              <p>Best regards,<br>
              <strong>The Profinder Team</strong></p>
            </div>
            
            <div class="footer">
              <p><strong>Profinder</strong> - Connecting you with trusted professionals</p>
              <p>This is an automated message, please do not reply to this email</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Hello!

Thank you for using Profinder - your trusted platform for finding verified professionals.

Your verification code is: ${otp}

This code will expire in 5 minutes for security purposes.

If you didn't request this code, please ignore this email.

Best regards,
The Profinder Team`,
    });

    // Save OTP in memory (valid for a few mins)
    otpStore[email] = { otp, createdAt: Date.now() };

    res.status(200).json({ message: 'OTP sent successfully' });
    console.log(`OTP sent to ${email}: ${otp}`);
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// ✅ Verify OTP (from in-memory store)
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const record = otpStore[email];
    if (!record || record.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Optional: check for expiry (e.g., 5 mins)
    const now = Date.now();
    const age = (now - record.createdAt) / 1000;
    if (age > 300) { // 5 minutes
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Success
    delete otpStore[email]; // Invalidate used OTP
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ message: 'OTP verification failed' });
  }
};

