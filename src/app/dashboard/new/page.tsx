"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../hooks/sessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PostCreateSchema } from "@/src/lib/use-create-post-validator";
import { PostCreateInput } from "@/src/lib/use-create-post-validator";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

export default function NewPostPage() {
  const form = useForm<PostCreateInput>({
    resolver: zodResolver(PostCreateSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      published: false,
      tags: "",
    },
  });
  useEffect(() => {
    form.setFocus("title");
  }, [form]);

  const router = useRouter();
  const { user } = useSession();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  if (!user)
    return <p className="p-4">You must be logged in to create a post.</p>;

  const handleSubmit = async (values: PostCreateInput) => {
    setError("");

    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      published: values.published?.valueOf(),
      tags: values.tags, // comma separated
    };

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to create post");
      return;
    }

    setMessage("Post created!");
    router.push(`/post/${data.post.slug}`);
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-4 sm:p-6 bg-white rounded-lg shadow mt-4 mb-8">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Create New Post
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    className="border w-full p-2 rounded text-base"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <Input
                    placeholder="slug-for-url (lowercase-dashes)"
                    {...field}
                    className="border w-full p-2 rounded text-base"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <Textarea
                    placeholder="Write your post..."
                    {...field}
                    className="border w-full p-2 rounded text-base min-h-[180px] sm:min-h-60"
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <Input
                    placeholder="tags (comma separated) e.g technology, service"
                    {...field}
                    className="border w-full p-2 rounded text-base"
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label>Publish now</Label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto">
              Create
            </Button>
          </div>
        </form>
      </Form>

      {message && <p className="text-green-600 mt-3 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-3 text-center">{error}</p>}
    </div>
  );
}
