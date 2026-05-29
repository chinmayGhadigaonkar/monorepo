import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, GeneralError } from "@/utils/error";
import handleError from "@/utils/handleError";

export async function POST(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        const body = await request.json();
        const { workspaceId, userId } = body; // userId - Other User

        if (!workspaceId || !userId) {
            throw new GeneralError("workspaceId and userId are required");
        }

        const workspaceUsers = await prisma.workspaceUser.findMany({
            where: {
                workspaceId: workspaceId,
                userId: {
                    in: [userId, session.user.id],
                },
            },
        });

        console.log(workspaceUsers);

        const expectedUsersCount = userId === session.user.id ? 1 : 2;
        if (workspaceUsers.length !== expectedUsersCount) {
            throw new GeneralError("Workspace users not found");
        }

        const map = new Map<string, string>();
        workspaceUsers.forEach((workspaceUser) => {
            map.set(workspaceUser.userId, workspaceUser.id);
        });

        const workspaceUserIds = Array.from(
            new Set([map.get(userId), map.get(session.user.id)])
        ).sort();

        const dmGroup = await prisma.dMGroup.upsert({
            where: {
                workspaceId_workspaceUserIds: {
                    workspaceId,
                    workspaceUserIds: workspaceUserIds as string[],
                },
            },
            select: {
                id: true,
                workspaceUserIds: true,
                workspaceUsers: {
                    where: {
                        userId: {
                            in: [userId],
                        },
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true,
                                phone: true,
                            },
                        },
                    },
                },
            },

            update: {},
            create: {
                createdByUserId: map.get(session.user.id) as string,
                workspaceUserIds: workspaceUserIds as string[],
                workspaceId,
                workspaceUsers: {
                    connect: [
                        { id: map.get(userId) as string },
                        { id: map.get(session.user.id) as string },
                    ],
                },
            },
        });

        return NextResponse.json(
            { data: { dmGroup }, message: "DM group upserted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
}
