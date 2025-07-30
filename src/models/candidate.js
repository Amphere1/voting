import mongoose from 'mongoose';

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  organization: String,
  bio: String,
  age: Number,
  img:{
    data:Buffer,
    contentType: String
  }
});

export default mongoose.model('Candidate', candidateSchema);
