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
    include: {
      followers: true,
      following: true,
      posts: {
        orderBy: {
          id: "desc",
        },
        include: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      bio: user.bio,
      imageUrl: user.imageUrl,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      postsCount: user.posts.length,
    },
    posts: user.posts,
  });
}
