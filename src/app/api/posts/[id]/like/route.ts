import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  try {
    await prisma.like.create({
      data: {
        postId,
        userId: session.user.id,
      },
    });
    const count = await prisma.like.count({ where: { postId } });
    return NextResponse.json({ liked: true, count });
  } catch (err: any) {
    if (err?.code === "P2002" || err?.meta?.target?.includes("postId_userId")) {
      return NextResponse.json({ error: "Already liked" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: postId } = await params;
  await prisma.like.deleteMany({ where: { postId, userId: session.user.id } });
  const count = await prisma.like.count({ where: { postId } });
  return NextResponse.json({ liked: false, count });
}
