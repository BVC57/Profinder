const mongoose = require('mongoose');
const AdminProfile = require('./models/AdminProfile');
const User = require('./models/User');
const config = require('./config');
require('dotenv').config();

async function testDatabase() {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check all users
    const users = await User.find({});
    console.log('\n=== All Users ===');
    console.log(`Total users: ${users.length}`);
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Check all admin profiles
    const adminProfiles = await AdminProfile.find({}).populate('userId');
    console.log('\n=== All Admin Profiles ===');
    console.log(`Total admin profiles: ${adminProfiles.length}`);
    adminProfiles.forEach(profile => {
      console.log(`- ID: ${profile._id}`);
      console.log(`  User: ${profile.userId?.name || 'Unknown'}`);
      console.log(`  Status: ${profile.status}`);
      console.log(`  Profession: ${profile.profession}`);
      console.log(`  City: ${profile.city}`);
      console.log('---');
    });
    
    // Check pending admin profiles
    const pendingProfiles = await AdminProfile.find({ status: 'pending' }).populate('userId');
    console.log('\n=== Pending Admin Profiles ===');
    console.log(`Total pending profiles: ${pendingProfiles.length}`);
    pendingProfiles.forEach(profile => {
      console.log(`- ${profile.userId?.name || 'Unknown'} (${profile.profession})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

testDatabase(); 