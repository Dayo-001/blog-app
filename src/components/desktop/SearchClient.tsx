"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import TagFilter from "./TagFilter";
import PostCard from "./PostCard";

const SearchClient = ({ posts }: { posts: any[] }) => {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const availableTags = [
    ...new Set(posts.flatMap((p) => p.tags.map((t: any) => t.name))),
  ];

  const filtered = posts.filter((post) => {
    const matchesQuery =
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase());

    const matchesTag = tag ? post.tags.some((t: any) => t.name === tag) : true;

    return matchesQuery && matchesTag;
  });

  return (
    <div className="space-y-4">
      <SearchBar onSearch={setQuery} />
      <TagFilter tags={availableTags} activeTag={tag} onSelect={setTag} />

      <div className="grid gap-4 mt-4">
        {filtered.map((post) => (
          <PostCard
            key={post.slug}
            title={post.title}
            slug={post.slug}
            content={post.content}
            likes={Array.isArray(post.likes) ? post.likes.length : post.likes}
            tags={post.tags.map((t: any) => t.name)}
            author={{
              name: post.author?.name,
              image: post.author?.image,
            }}
          />
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
};
export default SearchClient;
