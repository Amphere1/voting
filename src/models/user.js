import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String },
  dateOfBirth: { type: Date },
  role: { type: String, enum: ['admin', 'candidate', 'voter'], default: 'voter' },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
