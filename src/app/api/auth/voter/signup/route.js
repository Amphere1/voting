import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

  return NextResponse.json({ message: 'Voter registered successfully' }, { status: 201 });
}
