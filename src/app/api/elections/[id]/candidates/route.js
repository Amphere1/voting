import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import Candidate from '@/models/candidate';
import mongoose from 'mongoose';

// Get all candidates for a specific election
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params; // Await params in Next.js 15

    // Validate the election ID
    if (!id || id === 'undefined' || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid election ID' 
        }), 
        { status: 400 }
      );
    }

    // Find election and populate candidates
    const election = await Election.findById(id).populate('candidates');
    
    if (!election) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Election not found' 
        }), 
        { status: 404 }
      );
    }

    // Also get candidates by electionId field (alternative approach)
    const candidatesByElectionId = await Candidate.find({ electionId: id });

    // Combine both approaches to ensure we get all candidates
    const allCandidates = [...election.candidates];
    
    // Add candidates found by electionId that aren't already in the array
    candidatesByElectionId.forEach(candidate => {
      if (!allCandidates.find(c => c._id.toString() === candidate._id.toString())) {
        allCandidates.push(candidate);
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        election: {
          _id: election._id,
          title: election.title,
          description: election.description,
          startDate: election.startDate,
          endDate: election.endDate,
          status: election.status
        },
        candidates: allCandidates.map(candidate => ({
          _id: candidate._id,
          name: candidate.name,
          party: candidate.organization || candidate.party || 'Independent',
          age: candidate.age,
          education: candidate.education,
          experience: candidate.experience,
          manifesto: candidate.bio,
          image: candidate.img || candidate.image,
          votes: candidate.votes || 0,
          electionId: candidate.electionId
        }))
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching election candidates:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to fetch election candidates' 
      }), 
      { status: 500 }
    );
  }
}
