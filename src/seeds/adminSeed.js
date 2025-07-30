import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { dbConnect } from '../lib/dbconnect.js';
import User from '../models/user.js';

// Default admin credentials - keep these short and simple
const defaultAdmin = {
  name: 'Admin',
  email: 'admin@vote.com',
  password: 'admin123',
  role: 'admin',
  phone: '1234567890',
  city: 'Admin City',
  state: 'AC',
  zipCode: '12345'
};

async function seedAdmin() {
  try {
    // Connect to database
    await dbConnect();
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', defaultAdmin.email);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, saltRounds);

    // Create admin user
    const adminUser = new User({
      ...defaultAdmin,
      password: hashedPassword
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', defaultAdmin.email);
    console.log('🔑 Password:', defaultAdmin.password);
    console.log('⚠️  Please change these credentials after first login!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seeder
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAdmin();
}

export { seedAdmin };
