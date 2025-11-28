"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CommentSchema } from "@/src/lib/use-create-post-validator";
import { CommentCreateInput } from "@/src/lib/use-create-post-validator";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

type Comment = {
  id: string;
  content: string;
  createdAt: string | Date;
  author: {
    id: string;
    name?: string;
    image?: string;
  } | null;
};

const Comments = ({
  postId,
  existingComments,
  currentUserId,
}: {
  postId: string;
  existingComments: Comment[];
  currentUserId?: string;
}) => {
  const form = useForm<CommentCreateInput>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });
  const [comments, setComments] = useState(existingComments);
  const [error, setError] = useState("");

  const submitComment = async (values: CommentCreateInput) => {
    const result = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: values.content }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await result.json();
    if (!result.ok) {
      setError(data.error || "Failed to post comment");
      return;
    }

    setComments([data.comment, ...comments]); // add new comment
    form.reset(); // clear input
    setError("");
  };

  const deleteComment = async (commentId: string) => {
    const result = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });
    if (result.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>
      <div className="space-y-6 mb-10">
        {comments.length === 0 && (
          <div className="text-gray-400 italic">
            No comments yet. Be the first!
          </div>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-4"
          >
            <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden">
              {comment.author?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={comment.author.image}
                  alt={comment.author.name ?? "Author"}
                  className="w-10 h-10 object-cover rounded-full"
                />
              ) : comment.author?.name ? (
                comment.author.name[0].toUpperCase()
              ) : (
                "A"
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="font-semibold text-gray-800">
                  {comment.author?.name ?? "Anonymous"}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
            {currentUserId && comment.author?.id === currentUserId && (
              <Button
                onClick={() => deleteComment(comment.id)}
                className="ml-2 text-xs text-white bg-red-500 hover:underline hover:cursor-pointer hover:bg-red-600"
                title="Delete comment"
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitComment)}
          className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow space-y-4"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder="Write a comment..."
                    {...field}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 transition"
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-150 active:scale-95 hover:cursor-pointer"
          >
            Post Comment
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </Form>
    </div>
  );
};
export default Comments;
