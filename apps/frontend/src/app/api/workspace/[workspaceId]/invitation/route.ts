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

        const invitations = await prisma.invite.findMany({
            where: {
                workspaceId,
                type: "WORKSPACE",
            },
            include: {
                inviter: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileImage: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({ invitations });
    } catch (error) {
        return handleError(error, NextResponse);
    }
};
