import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { LayoutDashboard, PenBox } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

async function Header() {
  await checkUser()
  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className=" container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            alt="welth logo"
            width={200}
            height={60}
            src={"/logo1.png"}
            className="h-12 scale-[2.5] w-auto object-contain hidden md:inline"
          />
          <Image
            alt="welth logo"
            width={100}
            height={100}
            src={"/logo2.png"}
            className="h-12 w-auto object-contain md:hidden inline"
          />
        </Link>

        <div className="flex items-center space-x-4">
        <SignedIn>
            <Link href={'/dashboard'} className="text-gray-600 hover:text-blue-600 flex items-center gap-2">
                <Button variant="outline">
                <span><LayoutDashboard size={18}/></span>
                <span className="hidden md:inline">Dashboard</span>
                </Button>
            </Link>
            <Link href={'/transaction/create'} className="flex items-center gap-2">
                <Button>
                <span><PenBox size={18}/></span>
                <span className="hidden md:inline">Add Transaction</span>
                </Button>
            </Link>
        </SignedIn>
        <SignedOut forceRedirectUrl="/dashboard">
          <SignInButton>
            <Button variant="outline">Signin</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton appearance={{
            elements:{
                avatarBox:'w-10 h-10'
            }
          }} />
        </SignedIn>
        </div>
      </nav>
    </div>
  );
}

export default Header;
