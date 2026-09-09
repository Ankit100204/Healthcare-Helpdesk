import { z } from "zod";

export const registerSchema = z
    .object({
        firstName: z.string().trim().min(1, "First name is required"),
        lastName: z.string().trim().min(1, "Last name is required"),
        email: z.string().trim().email("Enter a valid email address"),
        phone: z
            .string()
            .regex(/^\d{10}$/, "Phone number must contain 10 digits"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
