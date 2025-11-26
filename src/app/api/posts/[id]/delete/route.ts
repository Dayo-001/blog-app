import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// type Params = {
//   id: string;
// };
// type RouteContext = {
//   params: Params;
// };

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post || post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.redirect("/dashboard");
}
