"use client";

import React from "react";

import { useParams, useSearchParams } from "next/navigation";

import DirectMessageMainPage from "./home/dms/direct-message-main-page";

const DMWorkspaceTab = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { workspaceId } = useParams<{ workspaceId: string }>();

    if (id) {
        return <DirectMessageMainPage userId={id} workspaceId={workspaceId} />;
    }

    return (
        <div className="bg-background flex h-screen flex-1 items-center justify-center">
            <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold">Direct Messages</h2>
                <p className="text-muted-foreground">
                    Select a conversation from the sidebar to start messaging.
                </p>
            </div>
        </div>
    );
};

export default DMWorkspaceTab;
