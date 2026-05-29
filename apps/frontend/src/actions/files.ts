import { prisma } from "@/lib/prisma";

import { getServerSession } from "./session";

export const getWorkspaceFiles = async (workspaceId: string) => {
    const session = await getServerSession();
    if (!session) return [];

    const workspaceUser = await prisma.workspaceUser.findFirst({
        where: {
            workspaceId: workspaceId,
            userId: session.user.id,
        },
    });

    if (!workspaceUser) return [];

    const files = await prisma.message.findMany({
        where: {
            files: {
                isEmpty: false,
            },
            OR: [
                {
                    workspaceChannel: {
                        workspaceId: workspaceId,
                        OR: [
                            {
                                workspaceUsers: {
                                    some: {
                                        id: workspaceUser.id,
                                    },
                                },
                            },
                            {
                                createdByUserId: session.user.id,
                            },
                        ],
                    },
                },
                {
                    dmGroup: {
                        workspaceId: workspaceId,
                        workspaceUserIds: {
                            has: workspaceUser.id,
                        },
                    },
                },
            ],
        },
        include: {
            workspaceChannel: true,
            senderUser: {
                include: {
                    user: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return files;
};
