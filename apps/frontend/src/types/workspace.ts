import { Workspace } from "@/prisma-types/client";

export type WorkspaceTab = "home" | "dms" | "activity" | "files";

export type FetchWorkspacesOutput = {
    workspaces: Workspace[];
};
export type FetchWorkspaceOutput = {
    workspace: Workspace;
};
