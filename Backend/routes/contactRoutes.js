const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const ContactSubmission = require('../models/ContactSubmission');
const nodemailer = require('nodemailer');

// Contact form submission route (public route)
router.post('/submit', contactController.submitContactForm);

// Get all contact form submissions (super admin only)
router.get('/submissions', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const submissions = await ContactSubmission.find({})
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submissions',
      error: error.message
    });
  }
});

// Get a single contact form submission by ID (super admin only)
router.get('/submissions/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error('Error fetching contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact submission',
      error: error.message
    });
  }
});

// Update contact form submission status (super admin only)
router.patch('/submissions/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const { status, notes, sendEmail } = req.body;
    
    const submission = await ContactSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    if (status) submission.status = status;
    if (notes) submission.notes = notes;
    
    await submission.save();
    
    // Send email notification if requested
    if (sendEmail) {
      try {
        // Create email transporter
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'chauhanbhadresh57@gmail.com',
            pass: 'zpqw mfng zvxd jxhw'
          }
        });
        
        // Status message for email
        const statusMessages = {
          new: 'received and is pending review',
          read: 'been reviewed by our team',
          replied: 'been processed and a reply has been sent',
          resolved: 'been resolved',
          spam: 'been marked as spam'
        };
        
        const statusMessage = statusMessages[status] || 'been updated';
        
        // Email content
        const mailOptions = {
          from: 'chauhanbhadresh57@gmail.com',
          to: submission.email,
          subject: `Update on your ProFinder contact submission: ${submission.subject}`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>ProFinder Contact Status Update</title>
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
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                h2 {
                  color: #667eea;
                  border-bottom: 2px solid #f4f4f4;
                  padding-bottom: 10px;
                }
                .content {
                  margin-top: 20px;
                }
                .footer {
                  margin-top: 30px;
                  padding-top: 10px;
                  border-top: 1px solid #f4f4f4;
                  text-align: center;
                  font-size: 0.8em;
                  color: #666;
                }
                .highlight {
                  background-color: #f8f9fa;
                  padding: 15px;
                  border-radius: 5px;
                  margin: 15px 0;
                }
                .status {
                  display: inline-block;
                  padding: 5px 10px;
                  border-radius: 15px;
                  font-size: 0.9em;
                  font-weight: bold;
                  color: white;
                  background-color: #667eea;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>Update on Your Contact Submission</h2>
                <div class="content">
                  <p>Hello ${submission.name},</p>
                  <p>Your contact submission regarding "${submission.subject}" has ${statusMessage}.</p>
                  <p>Current status: <span class="status">${status.toUpperCase()}</span></p>
                  
                  ${notes ? `
                  <div class="highlight">
                    <p><strong>Admin Notes:</strong></p>
                    <p>${notes.replace(/\n/g, '<br>')}</p>
                  </div>
                  ` : ''}
                  
                  <p>If you have any further questions, please don't hesitate to reply to this email.</p>
                  <p>Thank you for contacting ProFinder.</p>
                  <p>Best regards,<br>The ProFinder Team</p>
                </div>
                <div class="footer">
                  <p>© ${new Date().getFullYear()} ProFinder. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Status update email sent to ${submission.email}`);
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Continue with the response even if email fails
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Contact submission updated successfully',
      emailSent: sendEmail || false,
      submission
    });
  } catch (error) {
    console.error('Error updating contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact submission',
      error: error.message
    });
  }
});

// Delete contact form submission (super admin only)
router.delete('/submissions/:id', auth, authorizeRoles('superadmin'), async (req, res) => {
  try {
    const submission = await ContactSubmission.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    await ContactSubmission.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Contact submission deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact submission',
      error: error.message
    });
  }
});

module.exports = router;