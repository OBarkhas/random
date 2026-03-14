import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    console.log("Params received:", params);

    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        owner: true,
        likes: true,
        comments: { include: { user: true } },
      },
    });

    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    return NextResponse.json(post);
  } catch (err) {
    console.error("GET /posts/:id error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
