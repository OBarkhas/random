import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { ownerId, caption, imageUrl, content, title } = await req.json();
  const newPost = await prisma.post.create({
    data: {
      ownerId,
      caption,
      imageUrl,
      content,
      title,
    },
  });
  return NextResponse.json(newPost);
}
