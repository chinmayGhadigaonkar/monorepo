import { Message, User } from "@/prisma-types/client";

export type MessageType = Message & { senderUser: { user: User } };
