"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { SignedOut, SignedIn, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useUser();
  const isAuthPage = pathname === "/signin" || pathname === "/signup";

  useEffect(() => {
    if (isSignedIn && isAuthPage) {
      router.push("/");
    }
  }, [isSignedIn, isAuthPage, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <SignedOut>
        {!isAuthPage && (
          <header className="flex justify-end items-center p-4 gap-4 h-16 border-b bg-white">
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
        <header className="flex justify-end items-center p-4 gap-4 h-16 border-b bg-white">
          <p className="font-semibold text-gray-700">Welcome!</p>
        </header>
      </SignedIn>

      <main className="flex-1">{children}</main>
    </div>
  );
}
