"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaReply } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
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
import LiveTimeAgo from "@/src/components/desktop/LiveTimeAgo";

type Comment = {
  id: string;
  content: string;
  createdAt: string | Date;
  parentId?: string | null;
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

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

    setComments((prev) => [...prev, data.comment]); // add new comment
    form.reset(); // clear input
    setError("");
  };

  const postReply = async () => {
    if (!replyingTo) return;
    const result = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      body: JSON.stringify({ content: replyContent, parentId: replyingTo }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await result.json();
    if (!result.ok) {
      setError(data.error || "Failed to post reply");
      return;
    }

    setComments((prev) => [...prev, data.comment]);
    setReplyingTo(null);
    setReplyContent("");
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

  // helper to find the top-level ancestor of a comment
  const findCommentById = (id?: string | null) =>
    comments.find((c) => c.id === id);
  const findRootId = (c: Comment) => {
    const map = new Map(comments.map((x) => [x.id, x]));
    let current: Comment | undefined = c;
    while (current && current.parentId) {
      const parent = map.get(current.parentId);
      if (!parent) break;
      current = parent;
    }
    return current?.id ?? c.id;
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

        {comments
          .filter((c) => !c.parentId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          .map((top) => (
            <div key={top.id}>
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 bg-white border border-gray-200 rounded-xl shadow-sm p-3 sm:p-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden mb-2 sm:mb-0">
                  {top.author?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={top.author.image}
                      alt={top.author.name ?? "Author"}
                      className="w-10 h-10 object-cover rounded-full"
                    />
                  ) : top.author?.name ? (
                    top.author.name[0].toUpperCase()
                  ) : (
                    "A"
                  )}
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                    <div className="font-semibold text-gray-800">
                      {top.author?.name ?? "Anonymous"}
                    </div>
                    <div>
                      <LiveTimeAgo date={top.createdAt} />
                    </div>
                  </div>
                  <p className="text-gray-700 wrap-break-word">{top.content}</p>
                </div>

                <div className="flex items-start gap-2">
                  {currentUserId && top.author?.id === currentUserId && (
                    <Button
                      onClick={() => deleteComment(top.id)}
                      className="mt-2 sm:mt-0 sm:ml-2 text-xs text-black hover:cursor-pointer p-1 rounded-full bg-transparent hover:bg-transparent focus:outline-none"
                      title="Delete comment"
                    >
                      <MdDelete className="w-4 h-4" />
                    </Button>
                  )}
                  {currentUserId && (
                    <Button
                      onClick={() => {
                        setReplyingTo(top.id);
                        setReplyContent(`@${top.author?.name ?? "Anonymous"} `);
                      }}
                      className="mt-2 sm:mt-0 sm:ml-2 text-xs text-black hover:cursor-pointer p-1 rounded-full bg-transparent hover:bg-transparent focus:outline-none"
                      title="Reply to comment"
                    >
                      <FaReply className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="ml-8 mt-3 space-y-3">
                {comments
                  .filter((r) => r.parentId && findRootId(r) === top.id)
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((reply) => (
                    <div
                      key={reply.id}
                      className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 bg-white border border-gray-100 rounded-xl p-3 sm:p-4"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm overflow-hidden mb-2 sm:mb-0">
                        {reply.author?.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={reply.author.image}
                            alt={reply.author.name ?? "Author"}
                            className="w-8 h-8 object-cover rounded-full"
                          />
                        ) : reply.author?.name ? (
                          reply.author.name[0].toUpperCase()
                        ) : (
                          "A"
                        )}
                      </div>

                      <div className="flex-1 w-full">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 mb-1">
                          <div className="font-semibold text-gray-800">
                            {reply.author?.name ?? "Anonymous"}
                          </div>
                          <div>
                            <LiveTimeAgo date={reply.createdAt} />
                          </div>
                        </div>
                        <p className="text-gray-700 wrap-break-word">
                          {reply.content}
                        </p>
                      </div>
                      {currentUserId && reply.author?.id === currentUserId && (
                        <Button
                          onClick={() => deleteComment(reply.id)}
                          className="mt-2 sm:mt-0 sm:ml-2 text-xs text-black hover:cursor-pointer p-1 rounded-full bg-transparent hover:bg-transparent focus:outline-none"
                          title="Delete comment"
                        >
                          <MdDelete className="w-4 h-4" />
                        </Button>
                      )}
                      {currentUserId && (
                        <Button
                          onClick={() => {
                            setReplyingTo(reply.id);
                            setReplyContent(
                              `@${reply.author?.name ?? "Anonymous"} `
                            );
                          }}
                          className="mt-2 sm:mt-0 sm:ml-2 text-xs text-black hover:cursor-pointer p-1 rounded-full bg-transparent hover:bg-transparent focus:outline-none"
                          title="Reply to comment"
                        >
                          <FaReply className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}

                {/* show reply box if replyingTo is part of this thread */}
                {replyingTo &&
                  findRootId(findCommentById(replyingTo) as Comment) ===
                    top.id && (
                    <div className="mt-2">
                      <Textarea
                        rows={3}
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full mb-2"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={async () => {
                            await postReply();
                          }}
                          className="bg-blue-500 text-white hover:bg-blue-600 hover:cursor-pointer"
                        >
                          Reply
                        </Button>
                        <Button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className="bg-red-400 hover:bg-red-500 hover:cursor-pointer"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          ))}
      </div>
      {!replyingTo && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitComment)}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 shadow space-y-4"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Write a comment..."
                      {...field}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-200 transition text-base"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all duration-150 active:scale-95 hover:cursor-pointer w-full sm:w-auto"
            >
              Post Comment
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </Form>
      )}
    </div>
  );
};
export default Comments;
