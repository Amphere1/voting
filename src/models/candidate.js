import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: String,
  bio: String,
  age: Number,
  votes: { type: Number, default: 0 },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election' },
  experience: String,
  education: String,
  achievements: String, // store as comma-separated string for simplicity
  website: String,
  twitter: String,
  facebook: String,
  img: String, // store Cloudinary URL
  email: String,
  phone: String,
  dateOfBirth: String,
  slogan: String,
}, {
  timestamps: true
});

export default mongoose.models.Candidate || mongoose.model('Candidate', candidateSchema);
