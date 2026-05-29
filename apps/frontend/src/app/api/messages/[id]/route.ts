import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { prisma } from "@/lib/prisma";
import { ForbiddenError, GeneralError } from "@/utils/error";
import handleError from "@/utils/handleError";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession();
        if (!session) {
            throw new ForbiddenError("Unauthorized");
        }

        const { id } = await params;

        const message = await prisma.message.findUnique({
            where: { id },
            include: { senderUser: true },
        });

        if (!message) {
            throw new GeneralError("Message not found");
        }

        // Only the sender can delete their message
        if (message.senderUser.userId !== session.user.id) {
            throw new ForbiddenError("You can only delete your own messages");
        }

        await prisma.message.delete({
            where: { id },
        });

        return NextResponse.json(
            { message: "Message deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return handleError(error, NextResponse);
    }
}
