export async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (response.ok && data.isLoggedIn) {
      return {
        isAuthenticated: true,
        user: data.user,
        error: null
      };
    } else {
      return {
        isAuthenticated: false,
        user: null,
        error: data.error || 'Not authenticated'
      };
    }
  } catch (error) {
    return {
      isAuthenticated: false,
      user: null,
      error: 'Failed to check authentication status'
    };
  }
}

export function redirectToLogin() {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}
