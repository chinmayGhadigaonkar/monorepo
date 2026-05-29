import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

const colors = [
    "bg-gradient-to-br from-blue-500 to-blue-600",
    "bg-gradient-to-br from-green-500 to-green-600",
    "bg-gradient-to-br from-pink-500 to-pink-600",
    "bg-gradient-to-br from-purple-500 to-purple-600",
    "bg-gradient-to-br from-yellow-500 to-yellow-600",
];

const GET = async (req: Request, { params }: { params: Promise<{ workspaceId: string }> }) => {
    try {
        const { workspaceId } = await params;
        const session = await getServerSession();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

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
            color: colors[Math.floor(Math.random() * colors.length)],
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
