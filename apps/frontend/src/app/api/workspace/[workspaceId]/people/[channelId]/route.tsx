import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

const GET = async (
    req: Request,
    { params }: { params: Promise<{ workspaceId: string; channelId: string }> }
) => {
    try {
        const { workspaceId, channelId } = await params;
        const session = await getServerSession();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");
        const isMember = searchParams.get("isMember");

        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
        });

        if (!workspace) {
            throw new ForbiddenError("Workspace not found");
        }

        const member = await prisma.workspaceUser.findMany({
            where: {
                workspaceId: workspaceId,
                workspaceChannel: {
                    ...(isMember === "true"
                        ? {
                              some: {
                                  id: channelId,
                              },
                          }
                        : {
                              none: {
                                  id: channelId,
                              },
                          }),
                },

                ...(search && {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            user: {
                                email: {
                                    contains: search,
                                    mode: "insensitive",
                                },
                            },
                        },
                    ],
                }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                        designation: true,
                        phone: true,
                    },
                },
            },
        });

        const formattedMember = member.map((member) => ({
            id: member.user.id,
            name: member.user.name,
            email: member.user.email,
            profileImage: member.user.profileImage,
            designation: member.user.designation,
            phone: member.user.phone,
            role: member.role,
            status: "active",
            joinedAt: member.joinedAt,
        }));

        return NextResponse.json({
            member: formattedMember,
            message: "Member added successfully",
            status: SERVER_RESPONSE_STATUS.SUCCESS,
        });
    } catch (error) {
        console.log(error);
        return handleError(error, NextResponse);
    }
};

export { GET };
