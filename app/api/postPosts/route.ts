import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ownerId, caption, content, title, imageUrls } = await req.json();

  const user = await prisma.user.findUnique({ where: { clerkId: ownerId } });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const newPost = await prisma.post.create({
    data: {
      ownerId: user.id,
      caption,
      content,
      title,
      imageUrls: imageUrls || [],
    },
  });

  return NextResponse.json(newPost);
}
