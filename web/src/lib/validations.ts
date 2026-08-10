import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  inquiryType: z.enum(["tour", "transfer", "custom", "general"]),
  tourSlug: z.string().optional(),
  destinationSlug: z.string().optional(),
  travelDate: z.string().optional(),
  pax: z.number().int().positive().optional(),
  message: z.string().min(10, "Please provide a short message (min 10 characters)"),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
