"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ProgressLink from "./progress-link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";

function Header() {
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <ProgressLink href={"/"}>
          <div className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
              <span className="text-white font-black text-xl">F</span>
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              FinAI
            </span>
          </div>
        </ProgressLink>

        <div className="flex items-center space-x-4">
        <SignedIn>
            <ProgressLink href={'/dashboard'} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg">
                <span><LayoutDashboard size={18}/></span>
                <span className="hidden md:inline font-semibold">Dashboard</span>
                </Button>
            </ProgressLink>
            <ProgressLink href={'/transaction/create'} className="flex items-center gap-2">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
                <span><PenBox size={18}/></span>
                <span className="hidden md:inline font-semibold">Add Transaction</span>
                </Button>
            </ProgressLink>
        </SignedIn>
        <SignedOut forceRedirectUrl="/dashboard">
          <SignInButton>
            <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton appearance={{
            elements:{
                avatarBox:'w-10 h-10 ring-2 ring-purple-200 hover:ring-purple-400 transition-all'
            }
          }} />
        </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default Header;
