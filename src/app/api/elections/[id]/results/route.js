import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import Candidate from '@/models/candidate';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } = await params;
    
    // Find the election
    const election = await Election.findById(id).populate('candidates');
    
    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    // Get all candidates for this election with their vote counts
    const candidates = await Candidate.find({ electionId: id }).sort({ votes: -1 });
    
    // Calculate total votes
    const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);
    
    // Get voter turnout data
    const totalRegisteredVoters = await User.countDocuments({ role: 'voter' });
    const votersWhoVoted = await User.countDocuments({ 
      role: 'voter', 
      votedElections: { $in: [id] } 
    });
    
    // Calculate percentages and rankings
    const candidateResults = candidates.map((candidate, index) => {
      const votes = candidate.votes || 0;
      const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : '0.00';
      
      return {
        _id: candidate._id,
        name: candidate.name,
        party: candidate.organization || candidate.party,
        votes: votes,
        percentage: parseFloat(percentage),
        rank: index + 1,
        image: candidate.img,
        manifesto: candidate.bio || candidate.manifesto
      };
    });

    // Determine winner (candidate with most votes)
    const winner = candidateResults.length > 0 ? candidateResults[0] : null;
    
    // Calculate turnout percentage
    const turnoutPercentage = totalRegisteredVoters > 0 
      ? ((votersWhoVoted / totalRegisteredVoters) * 100).toFixed(2) 
      : '0.00';

    const results = {
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status
      },
      statistics: {
        totalVotes,
        totalRegisteredVoters,
        votersWhoVoted,
        turnoutPercentage: parseFloat(turnoutPercentage),
        candidateCount: candidates.length
      },
      candidates: candidateResults,
      winner: winner,
      isComplete: election.status === 'completed',
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({ success: true, results }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching election results:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch election results' 
    }, { status: 500 });
  }
}
