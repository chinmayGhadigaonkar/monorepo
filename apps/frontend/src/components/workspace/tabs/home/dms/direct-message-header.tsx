import React, { useState } from "react";

import { Hash, Loader2, User } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch } from "@/hooks/useSearch";
import { WorkspaceChannel, WorkspaceUser } from "@/prisma-types/client";

const DirectMessageHeader = () => {
    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const debouncedSearch = useDebounce(search, 500);
    const router = useRouter();

    const { searchData, fetchSearchLoading } = useSearch(
        workspaceId,
        debouncedSearch,
        "all" // fetch both channels and DMs
    );

    console.log(searchData);

    const handleOnSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.startsWith("#")) {
            setType("channel");
        } else if (e.target.value.startsWith("@")) {
            setType("dm");
        } else {
            setType("all");
        }
        setSearch(e.target.value);
    };

    const handleOnDMClick = (userId: string) => {
        // Pass userId so the page can find or create a DMGroup with this user
        router.push(`/workspace/${workspaceId}/home?type=dms&id=${userId}`);
        setSearch("");
    };

    const handleOnChannelClick = (channelId: string) => {
        router.push(`/workspace/${workspaceId}/home?type=channel&id=${channelId}`);
        setSearch("");
    };

    return (
        <div className="fixed flex w-full flex-col space-y-2 border-b bg-background px-4 pt-4 md:px-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground md:text-xl">New Message</h2>
            </div>
            <div className="mb-2 flex w-full items-center justify-start gap-2">
                <p className="w-fit text-sm font-medium">To : </p>
                <div className="relative flex-1">
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            type="text"
                            placeholder="#a-channel, @a-person or some@gmail.com"
                            className="border-none pl-0.5 ring-0 outline-none focus-visible:ring-0 focus-visible:outline-none"
                            value={search}
                            onChange={handleOnSearch}
                        />
                    </div>
                    {searchData && (
                        <Command
                            className="absolute top-full z-10 mt-1 h-auto max-h-44 w-full max-w-[calc(100%-30%)] overflow-hidden rounded-md border bg-popover py-1 text-popover-foreground shadow-md"
                            shouldFilter={false}
                        >
                            <CommandList>
                                {fetchSearchLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                        <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                                    </div>
                                ) : searchData && searchData.length > 0 ? (
                                    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                                    searchData.map((item: any) =>
                                        item.type === "channel" ? (
                                            <CommandItem
                                                key={`channel-${item.id}`}
                                                className="flex cursor-pointer items-center gap-2 px-3 py-2"
                                                onSelect={() => handleOnChannelClick(item.id)}
                                            >
                                                <Hash className="text-muted-foreground h-4 w-4 shrink-0" />
                                                <span className="truncate font-medium">
                                                    {item.name}
                                                </span>
                                            </CommandItem>
                                        ) : (
                                            <CommandItem
                                                key={`dm-${item.user?.id ?? item.id}`}
                                                className="flex cursor-pointer items-center gap-2 px-3 py-2"
                                                onSelect={() =>
                                                    handleOnDMClick(item.user?.id ?? item.id)
                                                }
                                            >
                                                <Avatar>
                                                    <AvatarImage src={item.user?.profileImage} />
                                                    <AvatarFallback>
                                                        {item.user?.name[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate font-medium">
                                                        {item.user?.name ?? item.name}
                                                    </span>
                                                    <span className="text-muted-foreground truncate text-xs">
                                                        {item.user?.email ?? item.email}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        )
                                    )
                                ) : (
                                    <CommandEmpty>No results found.</CommandEmpty>
                                )}
                            </CommandList>
                        </Command>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DirectMessageHeader;
