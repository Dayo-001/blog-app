import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function DashboardPosts({ userId }: { userId: string }) {
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: { tags: true, author: { select: { name: true, image: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-10 gap-4 sm:gap-0">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 text-center sm:text-left">
          Your Posts
        </h1>
        <Link
          href="/dashboard/new"
          className="px-4 sm:px-5 py-2 bg-blue-600 text-white rounded-full font-semibold shadow hover:bg-blue-700 transition text-base"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-gray-400">
          <span className="text-2xl mb-2">📝</span>
          <p className="italic text-center">You haven’t written any posts yet.</p>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostRow key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostRow({ post }: any) {
  return (
    <div className="border border-gray-200 bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:shadow-md transition">
      <div className="shrink-0">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg sm:text-xl overflow-hidden">
          {post.author?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.author.image}
              alt={post.author.name ?? "Author"}
              className="w-full h-full object-cover rounded-full"
            />
          ) : post.author?.name ? (
            post.author.name[0].toUpperCase()
          ) : (
            "A"
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
          {post.title}
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mb-2 break-all">/{post.slug}</p>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span
            className={
              post.published
                ? "inline-block px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-semibold"
                : "inline-block px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 font-semibold"
            }
          >
            {post.published ? "Published" : "Draft"}
          </span>
          {post.tags?.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {post.tags.map((tag: any) => (
                <span
                  key={tag.id || tag}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200 text-gray-600"
                >
                  #{tag.name || tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <Link
          href={`/dashboard/${post.slug}/edit`}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition text-center"
        >
          Edit
        </Link>
        <Link
          href={`/post/${post.slug}`}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-medium transition text-center"
        >
          View
        </Link>
        <form action={`/api/posts/${post.id}/delete`} method="post" className="w-full sm:w-auto">
          <Button
            type="submit"
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium transition w-full sm:w-auto"
          >
            Delete
          </Button>
        </form>
        <form action={`/api/posts/${post.id}/toggle`} method="post" className="w-full sm:w-auto">
          <Button
            type="submit"
            className={`px-3 py-1 rounded font-medium transition w-full sm:w-auto ${
              post.published
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {post.published ? "Unpublish" : "Publish"}
          </Button>
        </form>
      </div>
    </div>
  );
}
