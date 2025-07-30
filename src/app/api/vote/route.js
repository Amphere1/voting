import { dbConnect } from '@/lib/dbconnect';
import Candidate from '@/models/candidate';
import Election from '@/models/election';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Get user from token
    const token = cookies().get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { candidateId, electionId } = await request.json();

    if (!candidateId || !electionId) {
      return NextResponse.json({ error: 'Candidate ID and Election ID are required' }, { status: 400 });
    }

    // Check if user has already voted in this election
    const user = await User.findById(userId);
    if (user.votedElections && user.votedElections.includes(electionId)) {
      return NextResponse.json({ error: 'You have already voted in this election' }, { status: 400 });
    }

    // Check if election is ongoing
    const election = await Election.findById(electionId);
    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    const now = new Date();
    const startDate = new Date(election.startDate);
    const endDate = new Date(election.endDate);

    if (now < startDate || now > endDate) {
      return NextResponse.json({ error: 'Voting is not currently allowed for this election' }, { status: 400 });
    }

    // Update candidate vote count
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    candidate.votes = (candidate.votes || 0) + 1;
    await candidate.save();

    // Mark user as voted for this election
    if (!user.votedElections) {
      user.votedElections = [];
    }
    user.votedElections.push(electionId);
    await user.save();

    return NextResponse.json({ 
      message: 'Vote recorded successfully',
      candidate: candidate.name,
      votes: candidate.votes 
    }, { status: 200 });

  } catch (error) {
    console.error('Voting error:', error);
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 });
  }
}

// Get voting results for an election
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('electionId');
    
    if (!electionId) {
      return NextResponse.json({ error: 'Election ID is required' }, { status: 400 });
    }

    const election = await Election.findById(electionId).populate('candidates');
    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    // Get all candidates for this election with their vote counts
    const candidates = await Candidate.find({ electionId: electionId });
    
    const results = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      organization: candidate.organization,
      votes: candidate.votes || 0
    }));

    const totalVotes = results.reduce((sum, candidate) => sum + candidate.votes, 0);

    return NextResponse.json({ 
      election: {
        id: election._id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate
      },
      results,
      totalVotes 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching results:', error);
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 });
  }
}
