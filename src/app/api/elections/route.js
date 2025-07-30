import { dbConnect } from '@/lib/dbconnect';
import Election from '@/models/election';

export async function GET(req) {
  try {
    await dbConnect();
    const elections = await Election.find({});
    return new Response(JSON.stringify(elections), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching elections:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch elections' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
