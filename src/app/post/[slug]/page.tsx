export const dynamic = "force-dynamic";
import React from "react";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Comments from "./comments";
import { authClient } from "@/src/lib/auth-client";
import { headers } from "next/headers";
import { formatDistanceToNow } from "date-fns";
import LikeClientWrapper from "./LikeClientWrapper";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const requestHeaders = await headers();
  const session = await authClient.getSession({
    fetchOptions: { headers: requestHeaders },
  });
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      tags: true,
      author: { select: { id: true, email: true, name: true, image: true } },
      likes: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, email: true, name: true } } },
      },
    },
  });

  if (!post || !post.published) {
    return notFound();
  }
  return (
    <div className="max-w-3xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 rounded-2xl bg-white shadow-lg">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl sm:text-3xl overflow-hidden">
          {post.author?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.image}
              alt={post.author.name ?? "Author"}
              className="w-full h-full object-cover"
            />
          ) : post.author?.name ? (
            post.author.name[0].toUpperCase()
          ) : (
            "A"
          )}
        </div>
        <div className="flex flex-col items-center sm:items-start">
          <div className="font-semibold text-lg sm:text-xl text-gray-800">
            {post.author?.name ?? "Unknown"}
          </div>
          <div className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-gray-900 text-center sm:text-left">
        {post.title}
      </h1>

      <p className="prose prose-lg mb-8 max-w-none text-gray-800 wrap-break-word">
        {post.content}
      </p>
      <div className="mb-10">
        <LikeClientWrapper postId={post.id} />
      </div>

      <Comments
        postId={post.id}
        existingComments={post.comments}
        currentUserId={session.data?.user.id}
      />
    </div>
  );
};

export default PostPage;
