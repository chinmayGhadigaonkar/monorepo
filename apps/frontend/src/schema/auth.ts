import z from "zod";

export const loginSchema = z.object({
    email: z.email({ error: "Email is required" }),
    password: z.string({ error: "Password is required" }).min(8).max(20),
});

export const signUpSchema = z.object({
    name: z.string().min(1, "").max(40),
    email: z.email({ error: "Email is required" }),
    password: z.string({ error: "Password is required" }).min(8).max(20),
});
