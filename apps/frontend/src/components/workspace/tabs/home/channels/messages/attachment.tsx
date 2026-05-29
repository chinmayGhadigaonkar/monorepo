import { SetStateAction, useState } from "react";

import { Download, FileText } from "lucide-react";
import Image from "next/image";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/* ===================== Utils ===================== */

export const getOriginalFile = (url: string) => {
    const filename = url.split("/").pop();
    if (!filename) return null;

    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex === -1) return null;

    const type = filename.slice(lastDotIndex + 1).toLowerCase();
    const nameWithoutExt = filename.slice(0, lastDotIndex);
    const originalName = nameWithoutExt.replace(/_\d+$/, "");

    return {
        url,
        type,
        name: `${originalName}.${type}`,
    };
};

export const IMAGE_TYPES = ["jpg", "jpeg", "png", "gif", "webp"];
export const OFFICE_TYPES = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
export const AUDIO_TYPES = ["mp3", "wav", "ogg"];
export const VIDEO_TYPES = ["mp4", "mov", "avi", "wmv"];

const AttachmentMessageUI = ({ attachments }: { attachments: string[] }) => {
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
        <div className="mt-2 flex flex-wrap gap-4">
            {attachments.map((url, index) => {
                const file = getOriginalFile(url);
                if (!file) return null;

                /* ================= IMAGE ================= */
                if (IMAGE_TYPES.includes(file.type)) {
                    return (
                        <div
                            key={index}
                            className="group bg-muted hover:ring-primary/50 relative h-36 w-36 cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all hover:ring-2"
                            onClick={() => downloadFile(file.url, file.name)}
                        >
                            <Image
                                src={file.url}
                                alt={file.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <Download className="h-8 w-8 text-white drop-shadow-md" />
                            </div>
                        </div>
                    );
                }

                /* ================= AUDIO ================= */
                if (AUDIO_TYPES.includes(file.type)) {
                    return (
                        <div
                            key={index}
                            className="flex w-full max-w-xs shrink-0 items-center overflow-hidden rounded-full border shadow-sm"
                        >
                            <audio controls className="bg-muted/20 h-12 w-full max-w-xs outline-none">
                                <source src={file.url} type={`audio/${file.type}`} />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    );
                }

                /* ================= VIDEO ================= */
                if (VIDEO_TYPES.includes(file.type)) {
                    return (
                        <div
                            key={index}
                            className="group overflow-hidden rounded-xl border bg-black shadow-sm"
                        >
                            <video
                                width={320}
                                height={180}
                                controls
                                className="object-contain"
                                preload="metadata"
                            >
                                <source src={file.url} type={`video/${file.type}`} />
                                Your browser does not support the video element.
                            </video>
                        </div>
                    );
                }

                /* ================= DOCUMENT ================= */
                return (
                    <div
                        key={index}
                        className="bg-muted/20 hover:bg-muted/40 flex w-full max-w-sm items-center justify-between gap-4 rounded-xl border px-4 py-3 shadow-sm transition-colors"
                    >
                        <div
                            className="flex flex-1 cursor-pointer items-center gap-3 overflow-hidden"
                            onClick={() => openViewer(file)}
                        >
                            <div className="bg-background border-border/50 flex shrink-0 items-center justify-center rounded-lg border p-2.5 shadow-sm">
                                <FileText className="h-6 w-6 text-blue-500" />
                            </div>

                            <div className="flex flex-col overflow-hidden">
                                <p
                                    className="text-foreground truncate text-sm font-semibold"
                                    title={file.name}
                                >
                                    {file.name}
                                </p>
                                <span className="text-muted-foreground text-xs font-medium uppercase">
                                    {file.type} FILE
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => downloadFile(file.url, file.name)}
                            className="text-muted-foreground hover:bg-background hover:text-foreground hover:border-border/50 shrink-0 rounded-full border border-transparent p-2.5 transition-colors hover:shadow-sm"
                            title="Download file"
                        >
                            <Download className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}

            <DocumentViewerDialog
                open={openDialog}
                setOpen={setOpenDialog}
                url={viewerUrl}
                fileName={viewerFileName}
            />
        </div>
    );
};

/* ===================== Viewer Dialog ===================== */

interface DocumentViewerProps {
    open: boolean;
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    url: string;
    fileName: string;
}

export const DocumentViewerDialog = ({ open, setOpen, url, fileName }: DocumentViewerProps) => {
    if (!url) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="flex h-[80vh] w-[90vw] max-w-7xl flex-col gap-0 p-0 sm:max-w-7xl">
                <DialogTitle className="border-b px-4 py-3">
                    {fileName || "Document Viewer"}
                </DialogTitle>
                <div className="flex-1 overflow-hidden bg-gray-100 p-2">
                    <iframe
                        src={url}
                        className="h-full w-full rounded-md bg-white shadow-sm"
                        title="Document Viewer"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AttachmentMessageUI;
