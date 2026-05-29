import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

export async function GET(request: Request) {
    try {
        const session = await getServerSession();
        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        // here One Check is  Remaining if user is leave the grou
        const { searchParams } = new URL(request.url);

        const cursorId = searchParams.get("cursorId") ?? null;
        const channelId = searchParams.get("channelId");
        const directId = searchParams.get("directId");

        if (!channelId && !directId) {
            throw new ForbiddenError("channelId or directId is required");
        }

        const limit = 10;

        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    ...(channelId ? [{ workspaceChannelId: channelId }] : []),
                    ...(directId ? [{ dmGroupId: directId }] : []),
                ],
            },
            orderBy: { createdAt: "desc" },
            ...(cursorId && {
                cursor: {
                    id: cursorId,
                },
                skip: 1,
            }),
            include: {
                senderUser: {
                    include: {
                        user: true,
                    },
                },
            },
            take: limit,
        });

        return NextResponse.json(
            {
                data: {
                    messages,
                    nextCursor: messages.length ? messages[messages.length - 1].id : null,
                },
                message: "Message fetched successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
}
