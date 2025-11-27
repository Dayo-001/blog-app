import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { CommentSchema } from "@/src/lib/use-create-post-validator";

// type Params = {
//   id: string;
// };
// type RouteContext = {
//   params: Params;
// };

export async function POST(
  request: NextRequest,
  { params }: { params: Promis<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    console.log("params.id:", id, typeof id);
    const body = await request.json();
    const input = CommentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        content: input.content,
        post: { connect: { id } },
        author: { connect: { id: session.user.id } },
      },
      include: { author: { select: { id: true, email: true, name: true } } },
    });

    return NextResponse.json({ comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err?.message : "Failed to create comment",
      },
      { status: 400 }
    );
  }
}
