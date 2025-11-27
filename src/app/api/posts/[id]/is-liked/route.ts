import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const session = await auth.api.getSession({ headers: request.headers });
  const { id: postId } = await params;
  if (!session?.user) return NextResponse.json({ liked: false });

  const liked = await prisma.like.findUnique({
    where: { postId_userId: { postId, userId: session.user.id } },
  });
  return NextResponse.json({ liked: !!liked });
};
