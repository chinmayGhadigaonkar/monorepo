"use server";

import z from "zod";

import { prisma } from "@/lib/prisma";
import { WorkspaceUserRole } from "@/prisma-types/client";
import { workspaceSchema } from "@/schema/workspace";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

import { getServerSession } from "./session";

export const createWorkspace = async (data: z.infer<typeof workspaceSchema>) => {
    try {
        const session = await getServerSession();
        if (!session) throw new ForbiddenError("Unauthorized");

        const { name, profileImage } = data;

        const existing = await prisma.workspace.findFirst({
            where: {
                name,
                createdBy: session.user.id,
            },
        });

        if (existing) {
            return {
                message: "Workspace already exists",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const workspace = await prisma.$transaction(async (tx) => {
            // 1. Create workspace + add user as admin
            const ws = await tx.workspace.create({
                data: {
                    name,
                    profileImage,
                    createdBy: session.user.id,
                    updatedBy: session.user.id,
                    workspaceUsers: {
                        create: {
                            userId: session.user.id,
                            role: WorkspaceUserRole.ADMIN,
                        },
                    },
                },
            });

            // 2. Update last used
            await tx.user.update({
                where: { id: session.user.id },
                data: { lastUsedWorkspaceId: ws.id },
            });

            return ws; // return final workspace
        });

        return {
            message: "Workspace created successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: workspace,
        };
    } catch (error) {
        return handleError(error);
    }
};
