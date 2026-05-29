import { Socket } from "socket.io";

import { prisma } from "../lib/prisma.js";

declare module "socket.io" {
    interface Socket {
        user?: {
            id: string;
            name: string | null;
            email: string | null;
            image: string | null;
            workspaceId: string | null;
            userWorkspaceId: string | null;
        };
    }
}

export const SocketAuthMiddleware = async (socket: Socket, next: (err?: Error) => void) => {
    try {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new Error("Please authenticate using a valid token"));
        }

        const user = await prisma.workspaceUser.findFirst({
            where: {
                userId: token,
            },
            select: {
                workspaceId: true,
                id: true,
                user: true,
            },
        });
        if (!user) {
            return next(new Error("No user found"));
        }
        socket.user = {
            id: user.user.id,
            name: user.user.name,
            email: user.user.email,
            image: user.user.profileImage,
            workspaceId: user.workspaceId,
            userWorkspaceId: user.id,
        };

        next();
    } catch (error) {
        return next(new Error("Something is Wrong"));
    }
};
