const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-app');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// User schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'candidate', 'voter'], default: 'voter' },
  phone: String,
  city: String,
  state: String,
  zipCode: String,
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Default admin credentials - short and simple
const defaultAdmin = {
  name: 'Admin',
  email: 'admin@vote.com',
  password: 'admin123',
  role: 'admin',
  phone: '1234567890',
  city: 'City',
  state: 'ST',
  zipCode: '12345'
};

async function seedAdmin() {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: defaultAdmin.email });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', defaultAdmin.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);

    // Create admin user
    const adminUser = new User({
      ...defaultAdmin,
      password: hashedPassword
    });

    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', defaultAdmin.email);
    console.log('🔑 Password:', defaultAdmin.password);
    console.log('⚠️  Change these credentials after first login!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

// Run seeder
seedAdmin();
