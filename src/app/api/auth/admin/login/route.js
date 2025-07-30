
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// CORS preflight handler (for development)
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables.');
      return NextResponse.json({ error: 'Server misconfiguration: JWT_SECRET missing.' }, { status: 500 });
    }

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // Set JWT as HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

    return NextResponse.json({ message: 'Admin login successful' }, { status: 200 });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}