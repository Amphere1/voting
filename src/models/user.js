import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'candidate', 'voter'], default: 'voter' },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
