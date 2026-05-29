import z from "zod";

export const userProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    phone: z
        .string()
        .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
            message: "Invalid phone number format",
        })
        .optional()
        .or(z.literal("")),
    designation: z.string().max(100, "Designation is too long").optional().or(z.literal("")),
    status: z.enum(["active", "away", "do not disturb", "offline"]),
    profileImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
