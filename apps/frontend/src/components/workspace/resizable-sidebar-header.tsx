"use client";

import { FaRegEdit } from "react-icons/fa";
import { GoChevronDown } from "react-icons/go";
import { IoIosSettings, IoMdPersonAdd } from "react-icons/io";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useGetWorkspace } from "@/hooks/useWorkspace";
import { authClient } from "@/utils/auth-client";

import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ResizableSideBarHeader = ({ workspaceId }: { workspaceId: string }) => {
    const { workspace, fetchWorkspaceLoading } = useGetWorkspace({ workspaceId });
    const router = useRouter();

    const handleOnLogout = async () => {
        const { data, error } = await authClient.signOut();
        console.log(data);
        if (error) {
            console.log(error);
            return;
        }
        router.push("/signin");
    };
    return (
        <div className="flex items-center justify-between">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant={"ghost"}
                        className="flex cursor-pointer items-center gap-2 focus-visible:border-none focus-visible:ring-0"
                    >
                        <span className="text-base font-semibold">{workspace?.name}</span>
                        <GoChevronDown className="my-auto text-inherit" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                            <IoMdPersonAdd className="my-auto text-inherit" />
                            <p>Add Members</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
                            <IoIosSettings className="my-auto text-inherit" />
                            <p>Settings</p>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleOnLogout}
                        className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
                    >
                        <LogOut className="my-auto text-inherit" />
                        <p> Logout</p>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex items-center gap-1">
                <Tooltip delayDuration={500}>
                    <TooltipTrigger asChild>
                        <Link
                            href="?type=dms"
                            className="cursor-pointer focus-visible:border-none focus-visible:ring-0"
                        >
                            <FaRegEdit />
                        </Link>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        <p className="text-xs">New message</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
};

export default ResizableSideBarHeader;
