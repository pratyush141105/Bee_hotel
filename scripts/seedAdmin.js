/**
 * Admin Seeder Script
 *
 * Usage:
 *   ADMIN_NAME="Hotel Admin" ADMIN_EMAIL="admin@hotelbee.com" ADMIN_PASSWORD="SecurePass123" node scripts/seedAdmin.js
 *
 * Or simply run: npm run seed
 * (set env vars in .env or pass inline)
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import env from '../src/config/env.config.js';
import Admin from '../src/models/admin.model.js';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log('✅ MongoDB connected');

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      console.log('⚠️  An admin already exists. Skipping seed.');
      console.log(`   Email: ${existingAdmin.email}`);
      process.exit(0);
    }

    const name = process.env.ADMIN_NAME || 'Hotel Bee Admin';
    const email = process.env.ADMIN_EMAIL || 'admin@hotelbee.com';
    const password = process.env.ADMIN_PASSWORD || 'HotelBee@123';

    const admin = await Admin.create({ name, email, password });

    console.log('🎉 Super Admin created successfully!');
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID:    ${admin._id}`);
    console.log('\n⚠️  IMPORTANT: Change the default password immediately after first login!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
