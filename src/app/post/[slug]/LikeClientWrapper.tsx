"use client";
import useSWR from "swr";
import LikeButton from "./likeButton";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LikeClientWrapper({ postId }: { postId: string }) {
  const { data, mutate } = useSWR(`/api/posts/${postId}/like`, fetcher);

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <LikeButton
        postId={postId}
        initialLikes={data.count}
        onLikeChange={() => mutate()}
      />
    </>
  );
}
