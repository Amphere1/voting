import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'candidate', 'voter'], default: 'voter' },
  votedElections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Election' }],
  phone: String,
  dateOfBirth: Date,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  voterId: String,
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', userSchema);
