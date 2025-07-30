import { dbConnect } from '@/lib/dbconnect';
import Candidate from '@/models/candidate';
import Election from '@/models/election';
import mongoose from 'mongoose';

// Get individual candidate details
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await params in Next.js 15

    // Validate the candidate ID
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid candidate ID' 
        }), 
        { status: 400 }
      );
    }

    // Find candidate and populate election details
    const candidate = await Candidate.findById(id).populate('electionId');
    
    if (!candidate) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Candidate not found' 
        }), 
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        candidate: {
          _id: candidate._id,
          name: candidate.name,
          party: candidate.organization || candidate.party || 'Independent',
          age: candidate.age,
          education: candidate.education,
          experience: candidate.experience,
          manifesto: candidate.bio,
          image: candidate.img || candidate.image,
          votes: candidate.votes || 0,
          electionId: candidate.electionId?._id,
          election: candidate.electionId ? {
            _id: candidate.electionId._id,
            title: candidate.electionId.title,
            status: candidate.electionId.status
          } : null,
          achievements: candidate.achievements ? candidate.achievements.split(',').map(a => a.trim()) : [],
          slogan: candidate.slogan || `Vote for ${candidate.name}`,
          email: candidate.email,
          phone: candidate.phone,
          website: candidate.website,
          twitter: candidate.twitter,
          facebook: candidate.facebook
        }
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to fetch candidate details' 
      }), 
      { status: 500 }
    );
  }
}
