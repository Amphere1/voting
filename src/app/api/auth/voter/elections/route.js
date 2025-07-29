
import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const elections = await Election.find();
    return NextResponse.json(elections, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch elections' }, { status: 500 });
  }
}
