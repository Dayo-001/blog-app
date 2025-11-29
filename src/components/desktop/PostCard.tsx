import Link from "next/link";
import React from "react";

type Author = {
  name?: string;
  image?: string;
};

type Props = {
  title: string;
  slug: string;
  content: string;
  tags: string[];
  likes: number | string;
  author?: Author;
};

const PostCard = ({ title, slug, content, tags, likes, author }: Props) => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex gap-4 hover:shadow-md transition">
      {/* Author Avatar */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xl overflow-hidden mb-1">
          {author?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={author.image}
              alt={author.name ?? "Author"}
              className="w-12 h-12 object-cover rounded-full"
            />
          ) : author?.name ? (
            author.name[0].toUpperCase()
          ) : (
            "A"
          )}
        </div>
        <span className="text-xs text-gray-500">
          {author?.name ?? "Unknown"}
        </span>
      </div>
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <Link href={`/post/${slug}`}>
          <h2 className="text-xl font-bold text-blue-700 hover:underline">
            {title}
          </h2>
        </Link>
        <p className="text-gray-600 mt-1 line-clamp-3">{content}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full border border-gray-200 text-gray-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-3 text-sm text-pink-600 font-semibold flex items-center gap-1">
          <span role="img" aria-label="likes">
            ❤️
          </span>{" "}
          {likes}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
