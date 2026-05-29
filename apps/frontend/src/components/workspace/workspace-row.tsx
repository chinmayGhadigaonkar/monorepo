import React from "react";
import toast from "react-hot-toast";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import updateUserAction from "@/actions/user";
import { Workspace } from "@/prisma-types/client";
import { SERVER_RESPONSE_STATUS } from "@/types/base";
import { useAuthClientSession } from "@/utils/auth-client";

import { Button } from "../ui/button";
import { DropdownMenuLabel } from "../ui/dropdown-menu";

type WorkspaceProps = {
    workspace: Workspace;
    handleOnDialog?: () => void;
};

const WorkspaceRow: React.FC<WorkspaceProps> = ({ workspace, handleOnDialog }) => {
    const { data } = useAuthClientSession();
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const isActive = workspace?.id === workspaceId;

    const handleOnSwitchWorkspace = async () => {
        const payload = {
            lastUsedWorkspaceId: workspace?.id,
        };

        if (data?.user) {
            const res = await updateUserAction(data.user.id, payload);
            if (res.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                toast.success("Workspace Switched Successfully");
            } else {
                toast.error("Workspace Switched Failed");
            }
        } else {
            toast.error("User session not available!");
        }
    };

    return (
        <Link href={`/workspace/${workspace.id}/home`} onClick={handleOnSwitchWorkspace} className="block w-full">
            <DropdownMenuLabel
                onClick={handleOnDialog}
                className={`flex flex-row items-center space-x-3 rounded-md px-3 py-2 cursor-pointer transition-all duration-200 ${
                    isActive
                        ? "bg-btn-color text-white hover:bg-btn-color/90 shadow-sm"
                        : "hover:bg-accent text-foreground"
                }`}
            >
                {workspace.profileImage ? (
                    <div className="h-8 w-8 overflow-hidden rounded-md border-2 border-border/20 shrink-0">
                        <Image
                            src={workspace.profileImage}
                            alt={workspace.name}
                            width={50}
                            height={50}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <Button
                        variant={"outline"}
                        size={"icon-sm"}
                        className={`cursor-pointer text-white hover:ring-0 hover:outline-0 transition-colors border-transparent shrink-0 ${
                            isActive ? "bg-white/20 hover:bg-white/30" : "bg-btn-color hover:bg-btn-color/80"
                        }`}
                    >
                        {workspace.name.charAt(0).toUpperCase()}
                    </Button>
                )}
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-white font-semibold" : "text-foreground"}`}>
                        {workspace.name}
                    </p>
                </div>
            </DropdownMenuLabel>
        </Link>
    );
};

export default WorkspaceRow;
