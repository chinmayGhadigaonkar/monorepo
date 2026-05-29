import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { Workspace, WorkspaceChannel, WorkspaceUser } from "@/prisma-types/client";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession();

        const search = req.nextUrl.searchParams.get("search");
        const workspaceId = req.nextUrl.searchParams.get("workspaceId");
        const type = req.nextUrl.searchParams.get("type");

        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        if (!workspaceId) {
            throw new ForbiddenError("Workspace not found");
        }

        if (!search) {
            throw new ForbiddenError("Search not found");
        }

        let where = {};

        if (type === "channel") {
            where = {
                workspaceChannels: {
                    where: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                },
            };
        } else if (type === "dm") {
            where = {
                workspaceUsers: {
                    where: {
                        userId: {
                            not: session.user.id,
                        },
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                            ],
                        },
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true,
                            },
                        },
                    },
                },
            };
        } else {
            where = {
                workspaceChannels: {
                    where: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    },
                },
                workspaceUsers: {
                    where: {
                        userId: {
                            not: session.user.id,
                        },
                        user: {
                            OR: [
                                { name: { contains: search, mode: "insensitive" } },
                                { email: { contains: search, mode: "insensitive" } },
                            ],
                        },
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileImage: true,
                            },
                        },
                    },
                },
            };
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
            include: {
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                ...(where as any),
            },
        });

        const results = [
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ...((workspace as any)?.workspaceChannels?.map((channel: WorkspaceChannel) => ({
                ...channel,
                type: "channel",
            })) ?? []),
            // eslint-disable-next-line  @typescript-eslint/no-explicit-any
            ...((workspace as any)?.workspaceUsers?.map((user: WorkspaceUser) => ({
                ...user,
                type: "dm",
            })) ?? []),
        ];

        return NextResponse.json({
            results,
            message: "DMs channels fetched successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
        });
    } catch (error) {
        return handleError(error, NextResponse);
    }
};
