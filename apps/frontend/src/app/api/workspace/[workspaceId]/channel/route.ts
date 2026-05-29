import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

export const GET = async (req: Request, { params }: { params: Promise<{ workspaceId: string }> }) => {
    try {
        const { workspaceId } = await params;
        const session = await getServerSession();
        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }
        const channels = await prisma.workspaceChannel.findMany({
            where: {
                workspaceId,
                OR: [
                    {
                        createdByUserId: session.user.id,
                    },
                    {
                        workspaceUsers: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                ],
            },
            include: {
                _count: {
                    select: {
                        workspaceUsers: true,
                    },
                },
            },
        });
        return NextResponse.json({ channels });
    } catch (error) {
        return handleError(error, NextResponse);
    }
};
