import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { ForbiddenError } from "@/utils/error";
import handleError from "@/utils/handleError";

export async function GET() {
    try {
        const session = await getServerSession();

        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        const workspaces = await prisma.workspace.findMany({
            where: {
                OR: [
                    {
                        createdBy: session.user.id,
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
        });

        return NextResponse.json(
            {
                workspaces,
                messsage: "Workspaces fetched successfully",
                status: SERVER_RESPONSE_STATUS.SUCCESS,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
}
