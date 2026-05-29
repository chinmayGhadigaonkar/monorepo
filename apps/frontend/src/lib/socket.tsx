"use client";

import { createContext } from "react";

import { Socket } from "socket.io-client";
import { io } from "socket.io-client";

import { useAuthClientSession } from "@/utils/auth-client";

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: session } = useAuthClientSession();
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
        transports: ["websocket"],
        auth: {
            token: session?.user?.id,
        },
    });

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
