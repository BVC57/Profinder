const nodemailer = require('nodemailer');
const ContactSubmission = require('../models/ContactSubmission');

// Create a contact form submission controller
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Email validation regex
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }
    
    // Save to database
    const contactSubmission = new ContactSubmission({
      name,
      email,
      subject,
      message
    });
    
    await contactSubmission.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chauhanbhadresh57@gmail.com',
        pass: 'zpqw mfng zvxd jxhw'
      }
    });

    // Email content
    const mailOptions = {
      from: email,
      to: 'chauhanbhadresh57@gmail.com', // Change to your support email
      subject: `ProFinder Contact: ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ProFinder Contact Form</title>
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
          </style>
        </head>
        <body>
          <div class="container">
            <h2>New Contact Form Submission</h2>
            <div class="content">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div class="highlight">
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            <div class="footer">
              <p>This email was sent from the ProFinder contact form.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Send confirmation email to user
    const confirmationMailOptions = {
      from: 'chauhanbhadresh57@gmail.com',
      to: email,
      subject: 'Thank you for contacting ProFinder',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ProFinder Contact Confirmation</title>
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
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Thank You for Contacting Us</h2>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for reaching out to ProFinder. We have received your message and will get back to you as soon as possible.</p>
              <p>Here's a summary of your inquiry:</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong> ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}</p>
              <p>If you have any additional questions or information to provide, please don't hesitate to reply to this email.</p>
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

    await transporter.sendMail(confirmationMailOptions);

    res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      submissionId: contactSubmission._id
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error submitting contact form', 
      error: error.message 
    });
  }
};