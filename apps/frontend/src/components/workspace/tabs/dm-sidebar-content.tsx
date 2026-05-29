import React from "react";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";

import { DMSidebarClient } from "./dm-sidebar-client";

const DMSidebarContent = async ({ workspaceId }: { workspaceId: string }) => {
    const session = await getServerSession();

    const findUserId = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: session?.user.id,
        },
    });

    const dms = await prisma.dMGroup.findMany({
        where: {
            workspaceId: workspaceId,
            workspaceUserIds: {
                hasSome: [findUserId?.id ?? ""],
            },
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    senderUser: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                take: 1,
            },
        },
    });

    const allWorkspaceUserIds = Array.from(new Set(dms.flatMap((dm) => dm.workspaceUserIds)));
    const workspaceUsers = await prisma.workspaceUser.findMany({
        where: { id: { in: allWorkspaceUserIds } },
        include: { user: true },
    });

    const dmsWithUsers = dms.map((dm) => ({
        ...dm,
        workspaceUsers: dm.workspaceUserIds
            .map((id) => workspaceUsers.find((wu) => wu.id === id))
            .filter(Boolean) as typeof workspaceUsers,
    }));

    const mappedUserList = dmsWithUsers.map((dm) => {
        const other =
            dm.workspaceUsers.find((wu) => wu?.userId !== session?.user.id) || dm.workspaceUsers[0];

        return {
            dmId: dm.id,
            userId: other?.userId || "",
            name: other?.user?.name || "Direct Message",
            profileImage: other?.user?.profileImage || null,
            isCurrent: other?.userId === session?.user.id,
            lastMessage: dm.messages[0]?.content || "",
            lastMessageSender:
                dm.messages[0]?.senderUser?.user?.id === session?.user.id
                    ? "You"
                    : dm.messages[0]?.senderUser?.user?.name,
        };
    });

    return <DMSidebarClient workspaceId={workspaceId} dms={mappedUserList} />;
};

export default DMSidebarContent;
