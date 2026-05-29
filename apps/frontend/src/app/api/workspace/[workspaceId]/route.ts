import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    try {
        const { workspaceId } = await params;

        const session = await getServerSession();

        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        const workspace = await prisma.workspace.findUnique({
            where: {
                id: workspaceId,
            },
        });

        return NextResponse.json(
            {
                workspace,
                message: "Workspace fetched successfully",
                status: SERVER_RESPONSE_STATUS.SUCCESS,
            },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
}
