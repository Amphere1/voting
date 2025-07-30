import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Create a new election
export async function POST(req) {
  try {
    await dbConnect();
    
    // Verify authentication and require admin role
    const authResult = await verifyAuth('admin');
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { title, description, startDate, endDate, candidates } = await req.json();

    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      candidates,
    });

    return NextResponse.json({ message: 'Election created successfully', election }, { status: 201 });
  } catch (error) {
    console.error('Create election error:', error);
    return NextResponse.json({ error: 'Failed to create election' }, { status: 500 });
  }
}

// Get all elections
export async function GET() {
  try {
    await dbConnect();
    
    // Verify authentication and require admin role
    const authResult = await verifyAuth('admin');
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const elections = await Election.find().populate('candidates', 'name email');

    return NextResponse.json({ elections }, { status: 200 });
  } catch (error) {
    console.error('Get elections error:', error);
    return NextResponse.json({ error: 'Failed to fetch elections' }, { status: 500 });
  }
}
