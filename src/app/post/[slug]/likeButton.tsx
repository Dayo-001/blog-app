"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import { useSession } from "../../hooks/sessionContext";
import toast from "react-hot-toast";

const LikeButton = ({
  postId,
  initialLikes,
  onLikeChange,
}: {
  postId: string;
  initialLikes: number;
  onLikeChange: () => void;
}) => {
  const { user } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function check() {
      if (!user) {
        setLiked(false);
        return;
      }
      const result = await fetch(`/api/posts/${postId}/is-liked`);
      if (!result.ok) return;
      const data = await result.json();
      setLiked(!!data.liked);
    }
    check();
  }, [user, postId]);

  async function handleLike() {
    if (!user) {
      toast.error("You must be logged in to like this post", {
        duration: 4000,
      });
      return;
    }
    setLoading(true);
    if (!liked) {
      const result = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });
      const data = await result.json();
      if (result.ok) {
        setLiked(true);
        setLikes(data.count);
      } else {
        console.error(data);
      }
    } else {
      const result = await fetch(`/api/posts/${postId}/like`, {
        method: "DELETE",
      });
      const data = await result.json();
      if (result.ok) {
        setLiked(false);
        setLikes(data.count);
      }
    }
    setLoading(false);
    if (onLikeChange) {
      onLikeChange();
    }
  }

  return (
    <Button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-semibold shadow transition-all duration-150 active:scale-95 hover:cursor-pointer"
    >
      <FaHeart
        className={`w-5 h-5 transition-colors ${
          liked ? "text-pink-500" : "text-gray-400"
        }`}
      />
      {likes}
    </Button>
  );
};
export default LikeButton;
