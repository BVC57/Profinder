// One-time script to create Admin documents for all previously verified admins
const mongoose = require('mongoose');
const AdminProfile = require('./models/AdminProfile');
const Admin = require('./models/AdminModel');
const User = require('./models/User');
const config = require('./config');

async function migrateVerifiedAdmins() {
  await mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const verifiedProfiles = await AdminProfile.find({ status: 'verified' });
  let count = 0;
  for (const profile of verifiedProfiles) {
    const user = await User.findById(profile.userId);
    if (!user) continue;
    await Admin.findOneAndUpdate(
      { userId: profile.userId },
      {
        userId: profile.userId,
        profession: profile.profession,
        experience: profile.experience,
        city: profile.city,
        pincode: profile.pincode,
        verified: true
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    count++;
  }
  console.log(`Migrated ${count} verified admins to Admin collection.`);
  mongoose.disconnect();
}

migrateVerifiedAdmins().catch(console.error);
