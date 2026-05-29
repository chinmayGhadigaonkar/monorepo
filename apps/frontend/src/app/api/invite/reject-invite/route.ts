"use server";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import handleError from "@/utils/handleError";

export async function POST(req: Request) {
    try {
        const { inviteCode } = await req.json();

        if (!inviteCode) {
            return NextResponse.json({ error: "Invite code is required" }, { status: 400 });
        }

        // Find the invite
        const invite = await prisma.invite.findUnique({
            where: { inviteCode, status: "ACCEPTED" },
        });

        if (!invite) {
            return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
        }

        // Check if invite is already accepted or rejected
        if (invite.status !== "PENDING") {
            return NextResponse.json(
                { error: `Invite has already been ${invite.status.toLowerCase()}` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Invite rejected successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error rejecting invite:", error);
        return handleError(error, NextResponse);
    }
}
