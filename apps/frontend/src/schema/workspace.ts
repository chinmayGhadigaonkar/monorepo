import z from "zod";

export const workspaceSchema = z.object({
    name: z.string().min(3, "Workspace name is required"),
    profileImage: z.string().optional(),
});

export const workspaceChannelSchema = z.object({
    name: z.string().min(4, "Channel name is required").max(50, "Channel name is too long"),
    topic: z.string().max(100, "Channel topic is too long").optional(),
    description: z.string().max(200, "Channel description is too long").optional(),
    workspaceId: z.string("Invalid workspace ID").optional(),
});

export const updateChannelSchema = z.object({
    channelId: z.string(),
    workspaceId: z.string(),
    name: z
        .string()
        .min(4, "Channel name is required")
        .max(80, "Channel name is too long")
        .optional(),
    topic: z.string().max(250, "Channel topic is too long").optional(),
    description: z.string().max(250, "Channel description is too long").optional(),
});

export const addMemberToWorkspaceChannelSchema = z.object({
    workspaceId: z.string("Invalid workspace ID"),
    channelId: z.string("Invalid channel ID"),
    memberIds: z.array(z.string("Invalid member ID")),
});
