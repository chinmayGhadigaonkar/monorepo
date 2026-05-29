"use client";

import React from "react";

import { useParams, useSearchParams } from "next/navigation";

import ChannelMainPage from "./home/channels/channel-main-page";
import DirectoryPage from "./home/directories/directory-main-page";
import DirectMessageMainPage from "./home/dms/direct-message-main-page";

const HomeWorkspaceTab = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const type = searchParams.get("type");
    const { workspaceId } = useParams<{ workspaceId: string }>();
    switch (type) {
        case "channel":
            return <ChannelMainPage channelId={id!} />;
        case "dms":
            return <DirectMessageMainPage userId={id!} workspaceId={workspaceId} />;
        case "directory":
            return <DirectoryPage />;
        default:
            return <HomeDefaultView />;
    }
};

const HomeDefaultView = () => {
    return (
        <div className="flex h-screen flex-1 flex-col items-center justify-center bg-background px-4 text-center">
            <h1 className="text-3xl font-semibold text-foreground md:text-4xl">
                Welcome to Our <span className="text-btn-color">Workspace</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
                Collaborate, manage projects, and stay organized in one place. Your workspace is
                designed to help teams work smarter and faster.
            </p>
        </div>
    );
};

export default HomeWorkspaceTab;
