"use client";

import { ConfiguratorProvider } from "@/lib/configurator-context";
import { useParams } from "next/navigation";

export default function WorkspaceConfiguratorWrapper({ children }: { children: React.ReactNode }) {
    const { workspaceId } = useParams<{ workspaceId: string }>();

    // workspaceId may be undefined on root workspace pages — fall back to "default"
    return (
        <ConfiguratorProvider workspaceId={workspaceId ?? "default"}>
            {children}
        </ConfiguratorProvider>
    );
}
