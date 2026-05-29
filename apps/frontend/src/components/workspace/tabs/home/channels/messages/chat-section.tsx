import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import useMessage from "@/hooks/useMessage";
import { useSocket } from "@/hooks/useSocket";
import { MessageType } from "@/types/message";

import Message from "./message";

const ChatSection = ({ chatId, type }: { chatId: string; type: "Channel" | "DM" }) => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const queryClient = useQueryClient();

    const socket = useSocket();
    const channelId = type === "Channel" ? chatId : null;
    const directId = type === "DM" ? chatId : null;
    const {
        messages: responseMessages,
        hasNextPage,
        fetchNextPage,
        isFetching,
    } = useMessage({ channelId, directId });

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket.emit("join_channel", chatId);
        socket.on("New_Message", (data) => {
            console.log(data);

            setMessages((prev) => [...prev, { ...data }]);
        });
        return () => {
            if (messages.length > 0) {
                queryClient.removeQueries({ queryKey: ["messages"] });
            }
            socket.off("New_Message");
            socket.emit("leave_channel", chatId);

            setMessages([]);
        };
    }, [socket, chatId, queryClient]);

    const handleFetchNext = async () => {
        if (!scrollContainerRef.current) return;

        const prevScrollHeight = scrollContainerRef.current.scrollHeight;

        await fetchNextPage();

        requestAnimationFrame(() => {
            if (!scrollContainerRef.current) return;
            const newScrollHeight = scrollContainerRef.current.scrollHeight;
            scrollContainerRef.current.scrollTop += newScrollHeight - prevScrollHeight;
        });
    };

    if (isFetching && !responseMessages?.length) {
        return (
            <div className="flex flex-1 flex-col justify-end gap-6 p-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className="h-10 w-10 shrink-0 animate-pulse rounded-md bg-muted"></div>
                        <div className="flex w-full flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                                <div className="h-3 w-16 animate-pulse rounded bg-muted text-xs"></div>
                            </div>
                            <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                            {i % 2 === 0 && (
                                <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col-reverse overflow-x-hidden overflow-y-auto scroll-smooth">
            <div
                id="scrollableDiv"
                ref={scrollContainerRef}
                style={{
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column-reverse",
                    flex: 1,
                }}
            >
                <InfiniteScroll
                    dataLength={responseMessages?.length ?? 0}
                    next={handleFetchNext}
                    style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                        flex: 1,
                    }}
                    inverse={true} //
                    hasMore={hasNextPage}
                    loader={
                        <div className="flex w-full items-center justify-center py-4 text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            <span className="text-sm">Loading older messages...</span>
                        </div>
                    }
                    scrollableTarget="scrollableDiv"
                >
                    {responseMessages?.length === 0 && messages?.length === 0 && (
                        <div className="h-40">
                            <p className="text-center">No messages yet</p>
                        </div>
                    )}
                    <Message message={messages} />
                    <Message message={responseMessages ?? []} />
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default ChatSection;
