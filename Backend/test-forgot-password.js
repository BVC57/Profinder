const axios = require('axios');

// Test the forgot password endpoint
async function testForgotPassword() {
  try {
    console.log('Testing forgot password endpoint...');
    
    const testEmail = 'test@example.com'; // Replace with a real email for testing
    
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: testEmail
    });
    
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Test the reset password endpoint
async function testResetPassword() {
  try {
    console.log('Testing reset password endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
      token: 'test-token',
      newPassword: 'newpassword123'
    });
    
    console.log('✅ Success:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting forgot password tests...\n');
  
  await testForgotPassword();
  console.log('\n---\n');
  await testResetPassword();
  
  console.log('\n✅ Tests completed!');
}

runTests();
