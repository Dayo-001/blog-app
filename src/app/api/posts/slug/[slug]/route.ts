import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export const GET = async (req: NextRequest, { params }: any) => {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { tags: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
};
