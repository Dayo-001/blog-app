"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/src/app/hooks/sessionContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditPostPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  //   console.log("params in EditPostPage:", params);
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
  const { slug } = use(params);
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const result = await fetch(`/api/posts/slug/${slug}`); // we will create this GET route below
      if (!result.ok) {
        setError("Could not load post");
        setLoading(false);
        return;
      }
      const data = await result.json();
      setPost(data.post);
      setLoading(false);
    }
    load();
  }, [slug]);

  if (!user)
    return <p className="p-4">You must be logged in to edit this post</p>;
  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">Post not found</p>;
  if (post.authorId !== user.id)
    return <p className="p-4">You are not authorized to edit this post</p>;

  const handleSubmit = async (values: PostCreateInput) => {
    setError("");

    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      published: values.published?.valueOf(),
      tags: values.tags, // comma separated
    };

    const result = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await result.json();
    if (!result.ok) {
      setError(data.error || "Failed to update");
      return;
    }
    router.push(`/post/${data.post.slug}`);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    const result = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
    if (result.ok) router.push("/dashboard");
    else setError("Failed to delete");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="mb-3 w-full">
                <FormControl>
                  <Input
                    defaultValue={post.title}
                    placeholder="Title"
                    {...field}
                    className="border w-full p-2 rounded"
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
                    defaultValue={post.slug}
                    placeholder="slug-for-url (lowercase-dashes)"
                    {...field}
                    className="border w-full p-2 rounded"
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
                    defaultValue={post.content}
                    placeholder="Write your post..."
                    {...field}
                    className="border w-full p-2 rounded"
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
                    defaultValue={post.tags?.map((t: any) => t.name).join(",")}
                    placeholder="tags (comma separated) e.g technology, service"
                    {...field}
                    className="border w-full p-2 rounded"
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
                  <div>
                    <Checkbox
                      defaultChecked={post.published}
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

          <div className="flex space-x-3">
            <Button
              className="bg-green-600 text-white px-4 py-2 rounded"
              type="submit"
            >
              Save
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </Button>
          </div>
        </form>
      </Form>
      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
};
export default EditPostPage;
