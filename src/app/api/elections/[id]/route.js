import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import Candidate from '@/models/candidate';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const election = await Election.findById(id);
    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    // Get candidates for this election
    const candidates = await Candidate.find({ electionId: id });
    
    const candidatesWithImg = candidates.map((candidate) => {
      let img = null;
      if (candidate.img && candidate.img.data) {
        img = {
          data: candidate.img.data.toString('base64'),
          contentType: candidate.img.contentType,
        };
      }
      return {
        _id: candidate._id,
        name: candidate.name,
        organization: candidate.organization,
        age: candidate.age,
        bio: candidate.bio,
        votes: candidate.votes || 0,
        experience: candidate.experience,
        education: candidate.education,
        achievements: candidate.achievements,
        website: candidate.website,
        twitter: candidate.twitter,
        facebook: candidate.facebook,
        img,
      };
    });

    return NextResponse.json({ 
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        startDate: election.startDate,
        endDate: election.endDate,
        status: election.status
      },
      candidates: candidatesWithImg 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching election details:', error);
    return NextResponse.json({ error: 'Failed to fetch election details' }, { status: 500 });
  }
}
