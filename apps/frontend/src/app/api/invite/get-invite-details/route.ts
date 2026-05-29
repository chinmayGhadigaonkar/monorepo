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
            where: { inviteCode },
            include: {
                workspace: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                inviter: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!invite) {
            return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
        }

        // Check if invite is expired
        if (new Date() > invite.expiryAt) {
            return NextResponse.json({ error: "Invite has expired" }, { status: 400 });
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
                workspace: invite.workspace,
                inviter: invite.inviter,
                expiryAt: invite.expiryAt,
                status: invite.status,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching invite details:", error);
        return handleError(error, NextResponse);
    }
}
