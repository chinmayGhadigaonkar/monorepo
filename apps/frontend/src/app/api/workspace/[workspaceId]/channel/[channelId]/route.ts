import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import handleError from "@/utils/handleError";

export const GET = async (
    request: Request,
    { params }: { params: Promise<{ workspaceId: string; channelId: string }> }
) => {
    try {
        const { workspaceId, channelId } = await params;

        const findChannel = await prisma.workspaceChannel.findFirst({
            where: {
                id: channelId,
                workspaceId: workspaceId,
            },
        });

        if (!findChannel) {
            return NextResponse.json({ message: "Channel not found", status: 404 });
        }

        return NextResponse.json({
            channel: findChannel,
            message: "Channel fetched successfully",
            status: 200,
        });
    } catch (error) {
        return handleError(error, NextResponse);
    }
};
