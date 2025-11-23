import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { PostCreateSchema } from "@/src/lib/use-create-post-validator";
import { auth } from "@/src/lib/auth"; // better-auth instance
import { parseTags } from "@/src/lib/use-create-tag";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const input = PostCreateSchema.parse(body);

    // Upsert tags
    const tags = parseTags(input.tags);
    const connectTags = await Promise.all(
      tags.map(async (name) => {
        const existing = await prisma.tag.findUnique({ where: { name } });
        if (existing) return { id: existing.id };
        const created = await prisma.tag.create({ data: { name } });
        return { id: created.id };
      })
    );

    const post = await prisma.post.create({
      data: {
        title: input.title,
        slug: input.slug,
        content: input.content,
        published: !!input.published,
        author: { connect: { id: session.user.id } },
        tags: { connect: connectTags },
      },
    });

    return NextResponse.json({ post });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err?.message : "Failed to create post" },
      { status: 400 }
    );
  }
}
