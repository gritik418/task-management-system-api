import z from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must not exceed 150 characters"),
  description: z.string().max(1000, "Description too long").optional(),
});
