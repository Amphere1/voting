
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  await dbConnect();
  const { name, email, password } = await req.json();

  // Check if user already exists
  const existingUser = await User.findOne({ email, role: 'voter' });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new voter
  const user = new User({
    name,
    email,
    password: hashedPassword,
    role: 'voter',
  });
  await user.save();

  // Auto-login: set JWT as HTTP-only cookie
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  return NextResponse.json({ message: 'Voter registered successfully' }, { status: 201 });
}
