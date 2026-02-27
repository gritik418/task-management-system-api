import z from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(150, "Title must not exceed 150 characters"),
  description: z.string().max(1000, "Description too long").optional(),
});

export const getTasksQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]).optional(),
  search: z.string().trim().min(1).optional(),
});
