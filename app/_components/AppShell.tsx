"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SignedOut, SignedIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  useEffect(() => {
    if (isSignedIn && isAuthPage) {
      router.push("/");
    }
  }, [isSignedIn, isAuthPage, router]);
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SignedIn>
        <Sidebar />
      </SignedIn>

      <div className="flex-1 flex flex-col">
        <SignedOut>
          {!isAuthPage && (
            <header className="flex justify-end items-center p-4 gap-4 h-16 border-b bg-white shadow-sm">
              <Link href="/signup" className="font-semibold text-teal-600">
                Sign Up
              </Link>
              <Link href="/signin" className="font-semibold text-teal-600">
                Sign In
              </Link>
            </header>
          )}
        </SignedOut>

        <SignedIn>
          <header className="flex justify-between items-center p-4 h-16 border-b bg-white shadow-sm">
            <h1 className="text-xl font-semibold text-gray-800">
              Welcome, <span className="text-teal-600">{user?.firstName}</span>!
            </h1>
          </header>
        </SignedIn>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
