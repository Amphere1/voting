
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    const { 
      name, 
      email, 
      password, 
      phone, 
      dateOfBirth, 
      voterId 
    } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new voter
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'voter',
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      voterId,
    });
    
    await user.save();

    // Auto-login: set JWT as HTTP-only cookie
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return NextResponse.json({ 
      message: 'Voter registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB validation errors
    if (error.code === 11000) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}
