import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import Candidate from '@/models/candidate';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    
    const elections = await Election.find();
    const candidates = await Candidate.find();
    
    return NextResponse.json({
      elections: elections.map(e => ({
        _id: e._id,
        title: e.title,
        status: e.status,
        candidateCount: e.candidates?.length || 0
      })),
      candidates: candidates.map(c => ({
        _id: c._id,
        name: c.name,
        electionId: c.electionId,
        votes: c.votes
      })),
      debug: {
        totalElections: elections.length,
        totalCandidates: candidates.length,
        activeElections: elections.filter(e => e.status === 'active').length
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
