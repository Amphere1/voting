import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';

export async function GET() {
  await dbConnect();
  const token = cookies().get('token')?.value;
  if (!token) {
    return Response.json({ loggedIn: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return Response.json({ loggedIn: false });
    return Response.json({ loggedIn: true, user });
  } catch {
    return Response.json({ loggedIn: false });
  }
}
