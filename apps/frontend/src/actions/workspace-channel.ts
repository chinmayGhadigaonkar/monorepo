"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import {
    addMemberToWorkspaceChannelSchema,
    updateChannelSchema,
    workspaceChannelSchema,
} from "@/schema/workspace";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

import { getServerSession } from "./session";

const createWorkspaceChannel = async (data: z.infer<typeof workspaceChannelSchema>) => {
    try {
        const session = await getServerSession();

        if (session === null) {
            return {
                message: "Unauthorized",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }
        const { name, topic, description, workspaceId } = data;

        if (!workspaceId) {
            return {
                message: "workspaceId is required",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const createdChannel = await prisma.workspaceChannel.create({
            data: {
                name: name,
                topic: topic,
                description: description,
                createdByUserId: session.user.id,
                workspaceId: workspaceId,
                workspaceUsers: {
                    connect: {
                        workspaceId_userId: {
                            workspaceId,
                            userId: session.user.id,
                        },
                    },
                },
            },
        });
        revalidatePath(`/workspace/${workspaceId}/home`);

        return {
            message: "Workspace channel created successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: createdChannel,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

const addMemberToWorkspaceChannel = async (
    data: z.infer<typeof addMemberToWorkspaceChannelSchema>
) => {
    try {
        const session = await getServerSession();

        if (session === null) {
            return {
                message: "Unauthorized",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const { workspaceId, channelId, memberIds } = data;

        //  find Worspace Channel
        const findWorkspaceChannel = await prisma.workspaceChannel.findFirst({
            where: {
                id: channelId,
                workspaceId: workspaceId,
            },
        });
        console.log(findWorkspaceChannel);

        if (!findWorkspaceChannel) {
            return {
                message: "Workspace channel not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const addMember = await prisma.workspaceChannel.update({
            where: {
                id: channelId,
                workspaceId: workspaceId,
            },
            data: {
                workspaceUsers: {
                    connect: memberIds.map((userId) => ({
                        workspaceId_userId: {
                            workspaceId,
                            userId,
                        },
                    })),
                },
            },
        });
        revalidatePath(`/workspace/${workspaceId}/home`);
        return {
            message: "Member added to workspace channel successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: addMember,
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};

const updateChannelDetails = async (data: z.infer<typeof updateChannelSchema>) => {
    try {
        const session = await getServerSession();

        if (!session) {
            return {
                message: "Unauthorized",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const { channelId, workspaceId, name, topic, description } = data;

        const findChannel = await prisma.workspaceChannel.findFirst({
            where: {
                id: channelId,
                workspaceId: workspaceId,
            },
        });

        if (!findChannel) {
            return {
                message: "Channel not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const updatedChannel = await prisma.workspaceChannel.update({
            where: {
                id: channelId,
            },
            data: {
                ...(name && { name }),
                ...(topic !== undefined && { topic }),
                ...(description !== undefined && { description }),
            },
        });

        revalidatePath(`/workspace/${workspaceId}/home`);

        return {
            message: "Channel updated successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: updatedChannel,
        };
    } catch (error) {
        return handleError(error);
    }
};

export { addMemberToWorkspaceChannel, createWorkspaceChannel, updateChannelDetails };
