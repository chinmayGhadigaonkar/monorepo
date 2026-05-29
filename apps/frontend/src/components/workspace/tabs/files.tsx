import React from "react";

import { getWorkspaceFiles } from "@/actions/files";
import { Card } from "@/components/ui/card";

import { DirectMessageFileItem } from "./home/dms/direct-message-files";

const FilesWorkspaceTab = async ({ workspaceId }: { workspaceId: string }) => {
    const files = await getWorkspaceFiles(workspaceId);

    return (
        <div className="flex h-screen flex-1 flex-col overflow-hidden bg-background text-foreground">
            <div className="flex w-full flex-col">
                <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
                    <h1 className="text-lg font-semibold">All Files</h1>
                </div>
            </div>
            <div className="mb-12 overflow-y-auto">
                <Card className="mx-4 my-4 flex-1 border-border bg-card p-1">
                    {files?.length === 0 && (
                        <div className="bg-transparent text-muted-foreground flex flex-1 flex-col items-center justify-center p-8 text-center">
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
                                Files shared in this direct messages will appear here.
                            </p>
                        </div>
                    )}
                    {files?.map((file) => (
                        <DirectMessageFileItem key={file.id} message={file} />
                    ))}
                </Card>
            </div>
        </div>
    );
};

export default FilesWorkspaceTab;
