import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ loggedIn: true, user: { userId: decoded.userId, role: decoded.role } }, { status: 200 });
  } catch {
    return NextResponse.json({ loggedIn: false }, { status: 200 });
  }
}
