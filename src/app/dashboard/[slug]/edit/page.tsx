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

type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  authorId: string;
  tags: Tag[];
};

type Tag = {
  id: string;
  name: string;
};

const EditPostPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(params);
  const { user } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

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
      form.reset({
        title: data.post.title,
        slug: data.post.slug,
        content: data.post.content,
        published: data.post.published,
        tags: data.post.tags?.map((t: Tag) => t.name).join(","),
      });
      setLoading(false);
    }
    load();
  }, [slug, form]);

  if (!user)
    return <p className="p-4">You must be logged in to edit this post</p>;
  if (loading) return <p className="p-4">Loading...</p>;
  if (!post) return <p className="p-4">Post not found</p>;
  if (post && user && post.authorId !== user.id)
    return <p className="p-4">You are not authorized to edit this post</p>;

  const handleSubmit = async (values: PostCreateInput) => {
    setError("");

    const payload = {
      title: values.title,
      slug: values.slug,
      content: values.content,
      published: values.published?.valueOf(),
      tags: values.tags,
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
