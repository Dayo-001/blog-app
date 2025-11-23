import { PrismaClient } from "../app/generated/prisma/client";

export const prisma = new PrismaClient();

async function main() {
  // const user = await prisma.user.findFirst({
  //   where: {
  //     emailVerified: false,
  //   },
  // });
  // if (!user) {
  //   throw new Error("No user found");
  // }
  // console.log(user);
  // await prisma.post.createMany({
  //   data: [
  //     {
  //       title: "Hello-world",
  //       slug: "hello-world",
  //       content: "First post!",
  //       published: true,
  //       authorId: user.id,
  //     },
  //     {
  //       title: "Draft Post",
  //       slug: "draft-post",
  //       content: "asdfdafadfadadfadfadf",
  //       published: false,
  //       authorId: user.id,
  //     },
  //     {
  //       title: "Next.js Tips",
  //       slug: "nextjs-tips",
  //       content: "Some tips...",
  //       published: true,
  //       authorId: user.id,
  //     },
  //   ],
  // });
  // const post = await prisma.post.findUnique({
  //   where: { slug: "hello-world" },
  // });
  // if (!post) {
  //   throw new Error("no post found with this slug");
  // }
  // await prisma.post.update({
  //   where: { id: post.id },
  //   data: {
  //     tags: {
  //       connect: [
  //         { name: "tech" },
  //         { name: "service" },
  //         { name: "technology" },
  //         { name: "engineering" },
  //       ],
  //     },
  //   },
  // });
}

main();
