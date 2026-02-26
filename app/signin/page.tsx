"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SigninPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!isSignedIn && (
        <div className="w-full max-w-md p-6 border rounded shadow">
          <SignIn path="/signin" routing="path" signUpUrl="/signup" />
        </div>
      )}
    </div>
  );
}
