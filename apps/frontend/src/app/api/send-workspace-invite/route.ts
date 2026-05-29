"use server";

import { NextResponse } from "next/server";

import { getServerSession } from "@/actions/session";
import { generateWorkspaceInviteEmail } from "@/lib/email-templates";
import { prisma } from "@/lib/prisma";
import { emailQueue } from "@/lib/queue";
import handleError from "@/utils/handleError";

export async function POST(req: Request) {
    try {
        const { inviteEmail, inviterName, workspaceId } = await req.json();

        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Validate required fields
        if (!inviteEmail || !inviterName || !workspaceId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            select: {
                name: true,
            },
        });

        if (!workspace) {
            return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
        }

        const isPresentInWorkspace = await prisma.workspaceUser.findFirst({
            where: {
                user: {
                    email: inviteEmail,
                },
                workspaceId,
            },
        });

        if (isPresentInWorkspace) {
            return NextResponse.json(
                { error: "User is already a member of this workspace" },
                { status: 400 }
            );
        }

        // Check Invition is already sent
        const existingInvite = await prisma.invite.findFirst({
            where: {
                workspaceId,
                email: inviteEmail,
            },
        });

        if (existingInvite) {
            return NextResponse.json({ error: "Invite already sent" }, { status: 400 });
        }

        const inviteCode = crypto.randomUUID();
        const expiryAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await prisma.invite.create({
            data: {
                workspaceId,
                email: inviteEmail,
                inviterId: session.user.id,
                status: "PENDING",
                type: "WORKSPACE",
                expiryAt,
                inviteCode,
            },
        });

        const inviteLink = `${process.env.BETTER_AUTH_URL}/invite/${inviteCode}`;
        // Generate email HTML from template
        const emailHtml = generateWorkspaceInviteEmail({
            inviterName,
            workspaceName: workspace.name,
            workspaceDescription: "Join our workspace",
            inviteLink,
            baseUrl: process.env.BETTER_AUTH_URL || "http://localhost:3000",
        });

        // Send the email

        emailQueue.add(
            "sendEmail",
            {
                to: inviteEmail,
                subject: `You've been invited to join ${workspace.name} on TeamSync`,
                html: emailHtml,
            },
            {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
            }
        );

        return NextResponse.json(
            { success: true, message: "Invite sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error sending workspace invite:", error);
        return handleError(error, NextResponse);
    }
}
