"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoIcon from "./icons/LogoIcon";
import HamburgerIcon from "./icons/HamburgerIcon";
import { Button } from "./ui/button";
import { checkAuthStatus } from "@/lib/authUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authStatus = await checkAuthStatus();
      if (authStatus.isAuthenticated) {
        setUser(authStatus.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminClick = async (e) => {
    e.preventDefault();
    
    try {
      const authStatus = await checkAuthStatus();
      
      if (authStatus.isAuthenticated && authStatus.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/admin/login');
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/check', {
        method: 'POST',
      });
      
      if (response.ok) {
        setUser(null);
        router.push('/');
        // Refresh the page to clear any cached data
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[var(--border-color)] py-4">
          <Link href="/">
            <div className="flex items-center gap-3">
              <LogoIcon className="h-8 w-8 text-[var(--primary-color)]" />
              <h2 className="text-2xl font-bold tracking-tight">VoteWise</h2>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="nav-link text-base font-medium">
              Home
            </Link>
            <Link href="/elections" className="nav-link text-base font-medium">
              Elections
            </Link>
            <Link href="/contact" className="nav-link text-base font-medium">
              Contact
            </Link>
            <button 
              onClick={handleAdminClick}
              className="nav-link text-base font-medium cursor-pointer hover:text-blue-600 transition-colors"
            >
              Admin
            </button>
          </nav>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HamburgerIcon className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full">
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/elections" className="w-full">
                    Elections
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="w-full">
                    Contact
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAdminClick} className="cursor-pointer">
                  Admin
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {loading ? (
                  <DropdownMenuItem disabled>
                    Loading...
                  </DropdownMenuItem>
                ) : user ? (
                  <>
                    <DropdownMenuItem disabled>
                      <div className="text-left">
                        <div className="font-medium">Hello, {user.name}</div>
                        <div className="text-xs text-gray-500 capitalize">({user.role})</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login" className="w-full">
                        Login
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/register" className="w-full">
                        Register
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-gray-800 font-medium">Hello, {user.name}</span>
                  <div className="text-xs text-gray-500 capitalize">({user.role})</div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="secondary"
                    className="min-w-[90px] h-10 px-5 text-sm font-bold bg-gray-200"
                  >
                    Login
                  </Button>
                </Link>

                <Link href="/register">
                  <Button className="min-w-[90px] h-10 px-5 text-sm font-bold">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
