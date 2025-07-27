import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import { NextResponse } from 'next/server';

// Create a new election
export async function POST(req) {
  await dbConnect();
  const { title, description, startDate, endDate, candidates } = await req.json();

  const election = await Election.create({
    title,
    description,
    startDate,
    endDate,
    candidates,
  });

  return NextResponse.json({ message: 'Election created successfully', election }, { status: 201 });
}

// Get all elections
export async function GET() {
  await dbConnect();

  const elections = await Election.find().populate('candidates', 'name email');

  return NextResponse.json({ elections }, { status: 200 });
}
