import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import { NextResponse } from 'next/server';

// Update an election by ID
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  const updates = await req.json();

  const election = await Election.findByIdAndUpdate(id, updates, { new: true });

  if (!election) {
    return NextResponse.json({ error: 'Election not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Election updated successfully', election }, { status: 200 });
}

// Delete an election by ID
export async function DELETE(req, { params }) {
  await dbConnect();
  const { id } = params;

  const election = await Election.findByIdAndDelete(id);

  if (!election) {
    return NextResponse.json({ error: 'Election not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Election deleted successfully' }, { status: 200 });
}
