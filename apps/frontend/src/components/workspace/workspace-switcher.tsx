"use client";

import React, { useMemo } from "react";
import { FaPlus } from "react-icons/fa";

import { useParams, useRouter } from "next/navigation";

import useGetAllWorkpace from "@/hooks/useWorkspace";
import { Workspace } from "@/prisma-types/client";
import { useAuthClientSession } from "@/utils/auth-client";

import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import WorkspaceRow from "./workspace-row";

const WorkSpaceSwitchter = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const router = useRouter();

    const [openDialog, setOpenDialog] = React.useState(false);
    const { data } = useAuthClientSession();

    const { workspaces } = useGetAllWorkpace();

    const handleOnDialog = async () => {
        setOpenDialog(!openDialog);
    };

    const { selectedWorkspace, filterdWorkspaces } = useMemo(() => {
        return workspaces
            ? workspaces.reduce(
                  (
                      acc: {
                          selectedWorkspace: Workspace | null;
                          filterdWorkspaces: Workspace[];
                      },
                      workspace
                  ) => {
                      if (workspace.id === workspaceId) {
                          acc.selectedWorkspace = workspace;
                      } else {
                          acc.filterdWorkspaces.push(workspace);
                      }
                      return acc;
                  },
                  {
                      selectedWorkspace: null,
                      filterdWorkspaces: [],
                  }
              )
            : { selectedWorkspace: null, filterdWorkspaces: [] };
    }, [workspaceId, workspaces]);

    return (
        <DropdownMenu open={openDialog} onOpenChange={setOpenDialog}>
            <DropdownMenuTrigger className="ml-1" asChild>
                <Button
                    variant={"default"}
                    size={"icon-lg"}
                    className="bg-btn-color cursor-pointer border-transparent text-white hover:bg-btn-color hover:ring-0 hover:outline-0"
                >
                    {data?.user.name.charAt(0).toUpperCase()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 text-white" align="start">
                {/* Account Info */}
                <DropdownMenuLabel>
                    <p className="text-foreground text-sm font-medium">{data?.user?.name}</p>
                    <p className="text-muted-foreground text-sm">{data?.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Works Space */}
                {selectedWorkspace && <WorkspaceRow workspace={selectedWorkspace} />}
                <DropdownMenuSeparator />
                {filterdWorkspaces?.map((workspace) => (
                    <WorkspaceRow
                        key={workspace.id}
                        workspace={workspace}
                        handleOnDialog={handleOnDialog}
                    />
                ))}

                {/* Add Work Space */}

                <DropdownMenuItem
                    onSelect={(e) => {
                        router.push("/workspace/new");
                    }}
                >
                    <div className="text-text-color flex cursor-pointer items-center space-x-2 px-2 hover:bg-transparent">
                        <Button
                            variant="outline"
                            size="icon-sm"
                            className="flex cursor-pointer items-center space-x-2 border-none bg-slate-600 text-white hover:bg-slate-600/50 hover:ring-0 hover:outline-0"
                            asChild
                        >
                            <FaPlus className="h-4 w-4 text-white" />
                        </Button>
                        <span className="text-foreground text-sm font-medium">Add Workspace</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default WorkSpaceSwitchter;
