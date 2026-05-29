import { useState } from "react";
import toast from "react-hot-toast";

import { Download, EllipsisVertical, FileText, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMessageDocuments } from "@/hooks/useMessage";
import { MessageType } from "@/types/message";

import { DocumentViewerDialog, OFFICE_TYPES, getOriginalFile } from "./messages/attachment";

const ChannelFiles = ({ channelId }: { channelId: string }) => {
    const { messages, isLoading } = useMessageDocuments({
        channelId,
        directId: "",
    });

    return (
        <div className="mx-4 my-2 mb-10 flex-1 overflow-y-auto text-foreground">
            {isLoading ? (
                <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="animate-spin text-muted-foreground" />
                </div>
            ) : (
                <div className="mb-12 overflow-y-auto">
                    <p className="my-2 px-1 text-lg font-medium text-foreground">All Files</p>
                    <Card className="w-full gap-0 border-border bg-card px-1 py-1">
                        {messages?.messages?.length === 0 && (
                            <div className="flex flex-1 flex-col items-center justify-center bg-transparent p-8 text-center text-muted-foreground">
                                <div className="mb-4 rounded-full bg-blue-100/10 dark:bg-blue-950/40 p-4">
                                    <svg
                                        className="h-12 w-12 text-blue-500 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    No files shared yet
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Files shared in this channel will appear here.
                                </p>
                            </div>
                        )}
                        {messages?.messages?.map((message) => (
                            <ChannelFileItem key={message.id} message={message} />
                        ))}
                    </Card>
                </div>
            )}
        </div>
    );
};

const ChannelFileItem = ({ message }: { message: MessageType }) => {
    const file = getOriginalFile(message.files[0]);
    const [openDialog, setOpenDialog] = useState(false);
    const [viewerUrl, setViewerUrl] = useState("");
    const [viewerFileName, setViewerFileName] = useState("");

    const downloadFile = (url: string, name: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = name;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const openViewer = (file: ReturnType<typeof getOriginalFile>) => {
        if (!file) return;

        // PDF → native iframe
        if (file.type === "pdf") {
            setViewerUrl(file.url);
            setViewerFileName(file.name);
            setOpenDialog(true);
            return;
        }

        // Office → Google Docs Viewer
        if (OFFICE_TYPES.includes(file.type)) {
            const googleViewer = `https://docs.google.com/gview?url=${encodeURIComponent(
                file.url
            )}&embedded=true`;

            setViewerUrl(googleViewer);
            setViewerFileName(file.name);
            setOpenDialog(true);
            return;
        }

        // Fallback → download
        downloadFile(file.url, file.name);
    };
    return (
        <div className="flex items-center justify-between border-b border-border px-4 py-3 hover:bg-accent/20 transition-colors duration-200">
            <div className="flex items-center gap-3">
                <div className="bg-btn-color flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
                    <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p
                        className="cursor-pointer text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
                        onClick={() => openViewer(file)}
                    >
                        {file?.name || "File"}
                    </p>
                    <p className="text-muted-foreground text-xs">{message.senderUser.user.name}</p>
                </div>
            </div>
            <div>
                <ChannelFileItemMenu fileUrl={file?.url || ""} />
            </div>
            <DocumentViewerDialog
                open={openDialog}
                setOpen={setOpenDialog}
                url={viewerUrl}
                fileName={viewerFileName}
            />
        </div>
    );
};

const ChannelFileItemMenu = ({ fileUrl }: { fileUrl: string }) => {
    const downloadFile = (url: string) => {
        try {
            // Use the backend proxy to download the file
            const downloadUrl = `/api/download?url=${encodeURIComponent(url)}`;

            const link = document.createElement("a");
            link.href = downloadUrl;
            link.download = url.split("/").pop() || "file";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading file:", error);
            toast.error("Failed to download file");
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="cursor-pointer hover:bg-accent/80 p-1.5 rounded-md transition-colors flex items-center justify-center">
                    <EllipsisVertical className="text-muted-foreground h-4 w-4" size={16} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover border-border text-popover-foreground">
                <DropdownMenuItem onClick={() => downloadFile(fileUrl)} className="cursor-pointer hover:bg-accent transition-colors">
                    <Download className="mr-2 h-4 w-4" />
                    <span>Download</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <p>Share</p>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <p>Delete</p>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
export default ChannelFiles;
