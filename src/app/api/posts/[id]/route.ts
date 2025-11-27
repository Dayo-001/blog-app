import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { PostCreateSchema } from "@/src/lib/use-create-post-validator";
import { parseTags } from "@/src/lib/use-create-tag";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const input = PostCreateSchema.parse(body);

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const tags = parseTags(input.tags);
    const connectTags = await Promise.all(
      tags.map(async (name) => {
        const existing = await prisma.tag.findUnique({ where: { name } });
        if (existing) return { id: existing.id };
        const created = await prisma.tag.create({ data: { name } });
        return { id: created.id };
      })
    );

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        published: !!input.published,
        tags: { set: [], connect: connectTags }, // replace tags
      },
    });

    return NextResponse.json({ post: updated });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: err?.message || "Failed to update post" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
