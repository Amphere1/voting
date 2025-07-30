import mongoose from 'mongoose';


const electionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
}, {
  timestamps: true
});

export default mongoose.models.Election || mongoose.model('Election', electionSchema);
