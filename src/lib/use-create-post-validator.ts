import * as z from "zod";

export const PostCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(
      /^[a-z0-9\-]+$/,
      "Slug must be lowercase letters, numbers and dashes"
    ),
  content: z.string().min(10, "Content is too short"),
  published: z.boolean().optional(),
  tags: z.string().optional(), // comma separated
});

export type PostCreateInput = z.infer<typeof PostCreateSchema>;

export const CommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export type CommentCreateInput = z.infer<typeof CommentSchema>;
