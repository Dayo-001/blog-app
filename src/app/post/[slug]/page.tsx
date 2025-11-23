import React from "react";
import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import LikeButton from "./likeButton";
import Comments from "./comments";

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
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
    <div className="max-w-3xl mx-auto mt-10 p-6 rounded-2xl bg-white shadow-lg">
      <div className="mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl overflow-hidden">
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
        <div>
          <div className="font-semibold text-lg text-gray-800">
            {post.author?.name ?? "Unknown"}
          </div>
          <div className="text-sm text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div className="ml-auto flex gap-2">
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
      <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>

      <p className="prose prose-lg mb-8 max-w-none text-gray-800">
        {post.content}
      </p>
      <div className="mb-10">
        <LikeButton postId={post.id} initialLikes={post.likes.length} />
      </div>

      <Comments postId={post.id} existingComments={post.comments} />
    </div>
  );
};

export default PostPage;
