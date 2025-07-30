import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';

export async function GET() {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return NextResponse.json({ isLoggedIn: false }, { status: 200 });
      }

      return NextResponse.json({ 
        isLoggedIn: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }, { status: 200 });
      
    } catch (error) {
      return NextResponse.json({ isLoggedIn: false }, { status: 200 });
    }
    
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ isLoggedIn: false }, { status: 200 });
  }
}

// Logout route
export async function POST() {
  try {
    // Clear the authentication cookie
    const cookieStore = await cookies();
    cookieStore.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
