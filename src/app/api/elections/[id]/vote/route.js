import { dbConnect } from '@/lib/dbconnect';
import { verifyAuth } from '@/lib/auth';
import Candidate from '@/models/candidate';
import Election from '@/models/election';
import User from '@/models/user';
import mongoose from 'mongoose';

// Cast a vote for a candidate in an election
export async function POST(request, { params }) {
  try {
    await dbConnect();
    
    // Verify authentication and require voter role
    const authResult = await verifyAuth('voter');
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: authResult.error 
        }), 
        { status: 401 }
      );
    }
    
    const user = authResult.user;
    const { id: electionId } = await params; // Await params in Next.js 15
    const { candidateId } = await request.json();

    // Validate election ID
    if (!electionId || electionId === 'undefined' || !mongoose.Types.ObjectId.isValid(electionId)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid election ID' 
        }), 
        { status: 400 }
      );
    }

    // Validate candidate ID
    if (!candidateId || !mongoose.Types.ObjectId.isValid(candidateId)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid candidate ID' 
        }), 
        { status: 400 }
      );
    }

    // Check if user has already voted in this election
    if (user.votedElections && user.votedElections.includes(electionId)) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'You have already voted in this election' 
        }), 
        { status: 400 }
      );
    }

    // Validate election exists and is active
    const election = await Election.findById(electionId);
    if (!election) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Election not found' 
        }), 
        { status: 404 }
      );
    }

    if (election.status !== 'active' && election.status !== 'ongoing') {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Election is not currently active' 
        }), 
        { status: 400 }
      );
    }

    // Validate candidate exists and belongs to this election
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Candidate not found' 
        }), 
        { status: 404 }
      );
    }

    if (candidate.electionId && candidate.electionId.toString() !== electionId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Candidate does not belong to this election' 
        }), 
        { status: 400 }
      );
    }

    // Increment candidate votes
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    // Mark voter as having voted in this election
    await User.findByIdAndUpdate(user.id, { 
      $addToSet: { votedElections: electionId } 
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Vote cast successfully',
        candidateId,
        electionId
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error('Error casting vote:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to cast vote' 
      }), 
      { status: 500 }
    );
  }
}
