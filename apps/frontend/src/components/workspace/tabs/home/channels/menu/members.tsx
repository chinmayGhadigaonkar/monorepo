import React, { useState } from "react";

import { Loader2, Search, UserPlus } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetPeopleByChannel } from "@/hooks/useDIrectory";
import { useDebounce } from "@/hooks/useDebounce";
import { WorkspaceChannel } from "@/prisma-types/client";

import ChannelInviteDialog from "../channel-invite-dialog";

const ChannelMembers = ({ workspaceChannelData }: { workspaceChannelData: WorkspaceChannel }) => {
    const [inputValue, setInputValue] = useState("");
    const debouncedSearch = useDebounce(inputValue, 300);

    const { people: members, fetchPeopleLoading: membersLoading } = useGetPeopleByChannel({
        workspaceId: workspaceChannelData.workspaceId,
        channelId: workspaceChannelData.id,
        search: debouncedSearch,
        isMember: true,
    });

    return (
        <div className="mb-4 flex flex-col">
            <div className="p-4 pb-2">
                <div className="relative">
                    <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Find members"
                        className="pl-9"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-2">
                <ChannelInviteDialog>
                    <Button variant="ghost" className="h-14 w-full justify-start gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-100">
                            <UserPlus className="h-5 w-5 text-teal-600" />
                        </div>
                        <span className="text-base font-semibold">Add people</span>
                    </Button>
                </ChannelInviteDialog>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                {membersLoading ? (
                    <div className="flex h-20 items-center justify-center">
                        <Loader2 className="animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="flex flex-col px-2">
                        {members?.map((member) => (
                            <div
                                key={member.id}
                                className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-gray-100"
                            >
                                <Avatar className="h-9 w-9 rounded-md">
                                    <AvatarImage src={member.profileImage} />
                                    <AvatarFallback className="rounded-md">
                                        {member.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold">{member.name}</span>
                                        {/* You can add "(you)" logic here if we have current user context */}
                                    </div>
                                    {/* Status logic can be added here if available */}
                                </div>
                            </div>
                        ))}
                        {members?.length === 0 && (
                            <div className="py-4 text-center text-gray-500">No members found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChannelMembers;
