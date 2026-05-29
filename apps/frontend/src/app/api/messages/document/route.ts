import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

const GET = async (request: NextRequest) => {
    try {
        const searchParams = request.nextUrl.searchParams;
        const channelId = searchParams.get("channelId");
        const directId = searchParams.get("directId");

        if (!channelId && !directId) {
            throw new ForbiddenError("channelId or directId is required");
        }

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    ...(channelId ? [{ workspaceChannelId: channelId }] : []),
                    ...(directId ? [{ dmGroupId: directId }] : []),
                ],
                files: {
                    isEmpty: false,
                },
            },
            include: {
                senderUser: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(
            {
                data: {
                    messages,
                },
                message: "Message fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
};

export { GET };
