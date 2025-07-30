const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/voting-app');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// User schema
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

async function testAdminCredentials() {
  try {
    await connectDB();

    const adminEmail = 'admin@vote.com';
    const adminPassword = 'admin123';

    // Find admin user
    const admin = await User.findOne({ email: adminEmail, role: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('📅 Created:', admin.createdAt);

    // Test password
    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    
    if (isPasswordValid) {
      console.log('✅ Password is correct');
    } else {
      console.log('❌ Password is incorrect');
    }

  } catch (error) {
    console.error('❌ Error testing credentials:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
}

testAdminCredentials();
