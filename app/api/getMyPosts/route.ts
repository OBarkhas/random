import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  const posts = await prisma.post.findMany({
    where: { ownerId: user.id },
    orderBy: {
      id: "desc",
    },
    include: {
      likes: true,
      comments: true,
    },
  });
  return NextResponse.json(posts);
}
