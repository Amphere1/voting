"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogoIcon from "./icons/LogoIcon";
import HamburgerIcon from "./icons/HamburgerIcon";
import { Button } from "./ui/button";
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
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/check');
      const authData = await response.json();
      
      if (authData.isLoggedIn) {
        setUser(authData.user);
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
      const response = await fetch('/api/auth/check');
      const authData = await response.json();
      
      if (authData.isLoggedIn && authData.user.role === 'admin') {
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
        router.refresh(); // Refresh the page to clear any cached data
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
                      Welcome, {user.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
                <span className="text-gray-600">Welcome, {user.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="secondary"
                  className="min-w-[90px] h-10 px-5 text-sm font-bold bg-gray-200"
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
