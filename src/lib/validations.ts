import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Email is not valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Email is not valid"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const bookSchema = z.object({
  title: z.string().min(1, "The book title is required."),
  author: z.string().min(1, "The book author email is required."),
  description: z.string().min(1, "The book description email is required."),
});
