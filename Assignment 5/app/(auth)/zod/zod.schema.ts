import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  email: z
    .string()
    .email("Please enter a valid email"),

  phone: z
    .string()
    .regex(/^(\+8801|01)[3-9]\d{8}$/, "Enter a valid Bangladeshi phone number"),

  image: z
    .string()
    .url("Please enter a valid image URL"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "At least one uppercase letter is required")
    .regex(/[a-z]/, "At least one lowercase letter is required")
    .regex(/[0-9]/, "At least one number is required")
    .regex(/[^A-Za-z0-9]/, "At least one special character is required"),

  role: z.enum(["TENANT", "LANDLORD"]),
});

export type RegisterFormData = z.infer<typeof registerSchema>;