import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

type ClerkError = { code: string; message: string; longMessage?: string };
type ClerkErrorResponse = { errors: ClerkError[] };

function isClerkErrorResponse(err: unknown): err is ClerkErrorResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    Array.isArray((err as { errors?: unknown }).errors)
  );
}

export async function POST(req: Request) {
  try {
    if (!process.env.CLERK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing CLERK_SECRET_KEY" },
        { status: 500 },
      );
    }

    const body = await req.json();

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const username =
      typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : undefined;
    const bio = typeof body.bio === "string" ? body.bio.trim() : undefined;
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : undefined;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "email, username, password are required" },
        { status: 400 },
      );
    }

    const [existingEmail, existingUsername] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { username } }),
    ]);

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    const client = await clerkClient();

    const clerkUser = await client.users.createUser({
      emailAddress: [email],
      password,
    });

    const newUser = await prisma.user.create({
      data: {
        clerkId: clerkUser.id,
        email,
        username,
        name,
        bio,
        imageUrl,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 200 },
    );
  } catch (err: unknown) {
    console.error("SIGNUP ERROR 👉", err);

    if (isClerkErrorResponse(err)) {
      const e = err.errors?.[0];

      if (e?.code === "form_identifier_exists") {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 },
        );
      }

      return NextResponse.json(
        {
          error: e?.longMessage ?? e?.message ?? "Clerk error",
          code: e?.code ?? "unknown",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
