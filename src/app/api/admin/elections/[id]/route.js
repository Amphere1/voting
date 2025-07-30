import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

// Update an election by ID
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    
    // Verify authentication and require admin role
    const authResult = await verifyAuth('admin');
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = params;
    const updates = await req.json();

    const election = await Election.findByIdAndUpdate(id, updates, { new: true });

    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Election updated successfully', 
      election 
    }, { status: 200 });
  } catch (error) {
    console.error('Update election error:', error);
    return NextResponse.json({ error: 'Failed to update election' }, { status: 500 });
  }
}

// Delete an election by ID
export async function DELETE(req, context) {
  try {
    await dbConnect();
    
    // Verify authentication and require admin role
    const authResult = await verifyAuth('admin');
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { id } = await context.params;

    const election = await Election.findByIdAndDelete(id);

    if (!election) {
      return NextResponse.json({ error: 'Election not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Election deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete election error:', error);
    return NextResponse.json({ error: 'Failed to delete election' }, { status: 500 });
  }
}
