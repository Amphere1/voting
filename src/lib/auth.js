import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/dbconnect';
import User from '@/models/user';

export async function verifyAuth(requireRole = null) {
  try {
    await dbConnect();
    
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      // Check if user has required role
      if (requireRole && user.role !== requireRole) {
        return { success: false, error: `Access denied. ${requireRole} role required.` };
      }

      return { 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          votedElections: user.votedElections || []
        }
      };
    } catch (jwtError) {
      return { success: false, error: 'Invalid token' };
    }
  } catch (error) {
    return { success: false, error: 'Authentication verification failed' };
  }
}

export async function requireAuth(requireRole = null) {
  const authResult = await verifyAuth(requireRole);
  if (!authResult.success) {
    throw new Error(authResult.error);
  }
  return authResult.user;
}
