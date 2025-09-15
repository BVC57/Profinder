const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🧪 Testing email configuration...\n');

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'chauhanbhadresh57@gmail.com',
      pass: 'zpqw mfng zvxd jxhw'
    }
  });

  try {
    // Step 1: Verify transporter
    console.log('1️⃣ Verifying email transporter...');
    await transporter.verify();
    console.log('✅ Email transporter verified successfully\n');

    // Step 2: Send test email
    console.log('2️⃣ Sending test email...');
    const testEmail = 'test@example.com'; // Change this to your email for testing
    
    const mailOptions = {
      from: 'chauhanbhadresh57@gmail.com',
      to: testEmail,
      subject: '🧪 Profinder - Email Test',
      html: `
        <h2>Email Test</h2>
        <p>This is a test email to verify the email configuration is working.</p>
        <p>If you receive this email, the forgot password functionality should work.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📤 Response:', info.response);
    console.log('\n📋 Email Details:');
    console.log('- From:', mailOptions.from);
    console.log('- To:', mailOptions.to);
    console.log('- Subject:', mailOptions.subject);

  } catch (error) {
    console.error('❌ Email test failed:');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Response Code:', error.responseCode);
    console.error('Command:', error.command);
    
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check if the email and password are correct');
      console.log('2. Make sure 2-factor authentication is enabled on the Gmail account');
      console.log('3. Generate a new App Password from Google Account settings');
      console.log('4. Make sure "Less secure app access" is enabled (if not using App Password)');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your internet connection');
      console.log('2. Make sure port 587 or 465 is not blocked by firewall');
      console.log('3. Try using a different network');
    }
  }
}

// Run the test
testEmail();
