"use client";

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
import { useEffect, useState } from "react";
import UserIcon from "./icons/UserIcon";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/auth/voter/me").then(async (res) => {
      const data = await res.json();
      setLoggedIn(!!data.loggedIn);
    });
  }, []);
  const handleLogout = async () => {
    await fetch("/api/auth/voter/logout", { method: "POST" });
    setLoggedIn(false);
    window.location.href = "/";
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
            <Link href="/results" className="nav-link text-base font-medium">
              Elections
            </Link>
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
                <DropdownMenuSeparator />
                {!loggedIn ? (
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
                ) : (
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {!loggedIn ? (
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="secondary"
                className="min-w-[90px] h-10 px-5 text-sm font-bold bg-gray-200"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button className="min-w-[90px] h-10 px-5 text-sm font-bold">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserIcon className="h-7 w-7 text-gray-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
