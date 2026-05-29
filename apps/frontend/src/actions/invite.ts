"use server";

import { prisma } from "@/lib/prisma";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import handleError from "@/utils/handleError";

import { getServerSession } from "./session";

const addUserToWorkspaceAction = async ({ inviteCode }: { inviteCode: string }) => {
    try {
        const session = await getServerSession();

        if (session === null) {
            return {
                message: "Unauthorized",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const invite = await prisma.invite.findUnique({
            where: {
                inviteCode: inviteCode,
            },
        });

        console.log(invite);
        if (invite === null) {
            return {
                message: "Invite not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: invite.workspaceId!,
            },
        });

        if (workspace === null) {
            return {
                message: "Workspace not found",
                status: SERVER_RESPONSE_STATUS.FAILED,
            };
        }

        // Create the workspace user relationship
        const userWorkspace = await prisma.workspaceUser.create({
            data: {
                userId: session.user.id,
                workspaceId: invite.workspaceId!,
                role: "MEMBER",
            },
        });

        // Update the user's last used workspace
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                lastUsedWorkspaceId: workspace.id,
            },
        });

        console.log("User added to workspace successfully");

        return {
            message: "User added to workspace successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
            data: userWorkspace,
        };
    } catch (error) {
        return handleError(error);
    }
};

export { addUserToWorkspaceAction };
