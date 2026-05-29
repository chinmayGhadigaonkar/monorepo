import cors from "cors";
import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { prisma } from "./lib/prisma.js";
import { SocketAuthMiddleware } from "./middleware/auth.js";

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.get("/", (req, res) => {
    res.send("Server is running");
});

io.use(async (socket, next) => {
    await SocketAuthMiddleware(socket, next);
});

io.on("connection", (socket) => {
    const user = socket.user;
    if (!user) {
        console.log("User not found");
        return;
    }

    socket.on("join_channel", (channelId: string) => {
        socket.join(channelId);
        console.log(`User ${socket.id} joined channel ${channelId}`);
    });

    socket.on("leave_channel", (channelId: string) => {
        socket.leave(channelId);
        console.log(`User ${socket.id} left channel ${channelId}`);
    });

    socket.on("New_Message", async ({ chatId, message, attachment, type = "Channel" }) => {
        try {
            if (!chatId || !message) return;

            const storedMessage = await prisma.message.create({
                data: {
                    content: message,
                    ...(type === "Channel" && { workspaceChannelId: chatId }),
                    ...(type === "DM" && { dmGroupId: chatId }),
                    senderId: user.userWorkspaceId!,
                    ...(attachment && { files: [attachment] }),
                },
                include: {
                    senderUser: true,
                },
            });

            io.to(chatId).emit("New_Message", {
                ...storedMessage,
                senderUser: { user },
            });
        } catch (error) {
            console.error("Socket message error:", error);

            // optional: notify sender only
            socket.emit("Message_Error", {
                message: "Failed to send message",
            });
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
