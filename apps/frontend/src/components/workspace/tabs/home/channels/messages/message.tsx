import DOMPurify from "dompurify";
import { MoreHorizontal, Trash } from "lucide-react";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDeleteMessage } from "@/hooks/useMessage";
import { formatDate } from "@/lib/utils";
import { MessageType } from "@/types/message";
import { useAuthClientSession } from "@/utils/auth-client";

import AttachmentMessageUI from "./attachment";

export const deltaToHtml = (content: string): string => {
    try {
        const delta = JSON.parse(content ?? "");
        const converter = new QuillDeltaToHtmlConverter(delta.ops, {
            multiLineParagraph: false,
            multiLineCodeblock: true,
        });
        return converter.convert();
    } catch {
        return content || "";
    }
};

const Message = ({ message }: { message: MessageType[] }) => {
    const { data: user } = useAuthClientSession();
    const { mutate: deleteMessage, isPending: isDeleting } = useDeleteMessage();

    if (!message?.length) return null;

    return (
        <div className="flex flex-col gap-3 px-4 py-2">
            {message.map((msg, index) => {
                const isSender = msg.senderUser.user.id === user?.user.id;

                const html = deltaToHtml(msg?.content ?? "");

                return (
                    <div
                        key={msg.id}
                        className="group animate-slide-fade relative flex gap-3 rounded px-2 py-2 transition-colors hover:bg-accent/30"
                    >
                        {/* Hover Actions Banner */}
                        <div className="absolute -top-3 right-4 hidden items-center gap-1 rounded-md border border-border bg-card p-1 shadow-sm group-hover:flex">
                            {isSender && (
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    disabled={isDeleting}
                                    className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-red-500 disabled:opacity-50"
                                >
                                    <Trash size={16} />
                                </button>
                            )}
                            <button className="flex h-8 w-8 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent">
                                <MoreHorizontal size={16} />
                            </button>
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-10 w-10 shrink-0 rounded-md">
                            <AvatarImage
                                src={msg.senderUser.user.profileImage || ""}
                                alt={msg.senderUser.user.name}
                            />
                            <AvatarFallback className="flex items-center justify-center rounded-md bg-pink-600 font-bold text-white">
                                {msg.senderUser.user.name?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex w-full flex-col overflow-hidden">
                            <div className="flex items-baseline gap-2">
                                <span className="font-bold text-foreground">
                                    {msg.senderUser.user.name || "Anonymous"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {formatDate(msg.createdAt)}
                                </span>
                            </div>

                            <div
                                className="prose prose-sm max-w-none text-foreground dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
                            />

                            {msg.files.length > 0 && (
                                <div className="mt-1">
                                    <AttachmentMessageUI attachments={msg.files} />
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Message;
