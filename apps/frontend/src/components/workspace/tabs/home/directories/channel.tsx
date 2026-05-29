import { useState } from "react";
import { IoAdd } from "react-icons/io5";

import { Hash, Search, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetWorkspaceChannels } from "@/hooks/useWorkspaceChannel";
import { WorkspaceChannel } from "@/prisma-types/client";

import CreateChannelDialog from "../channels/create-channels-dialog";

const Channel = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { workspaceId } = useParams();

    const { workspaceChannelData, fetchWorkspaceChannelLoading } = useGetWorkspaceChannels(
        workspaceId as string
    );

    const filteredChannels = workspaceChannelData?.filter((channel: WorkspaceChannel) =>
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full flex-col overflow-hidden bg-background text-foreground p-4">
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="relative flex-1 md:max-w-2xl">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                        <Search size={18} />
                    </span>
                    <Input
                        placeholder="Search for channels"
                        className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <CreateChannelDialog>
                    <Button variant={"outline"}>
                        <IoAdd size={15} className="my-auto text-inherit" />
                        Create Channel
                    </Button>
                </CreateChannelDialog>
            </div>

            <div className="flex flex-1 flex-col bg-background">
                {/* Invitation Banner */}
                <div className="border-b border-border bg-gradient-to-r from-blue-600/90 to-blue-700/90 px-4 py-8 md:px-6 md:py-12">
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                        Organize your team’s conversations
                    </h3>
                    <p className="mt-2 text-sm text-blue-50 md:text-base">
                        Channels are spaces for gathering all the right people, messages, files and
                        tools. Organize them by any project, group, initiative or topic of your
                        choosing.
                    </p>
                    <div className="mt-4">
                        <CreateChannelDialog>
                            <Button variant={"outline"} className="border-none bg-white/10 hover:bg-white/20 text-white">
                                <IoAdd size={15} className="my-auto text-inherit" />
                                Create Channel
                            </Button>
                        </CreateChannelDialog>
                    </div>
                </div>

                {/* List of Channels */}
                <div className="px-4 py-6 md:px-6">
                    {fetchWorkspaceChannelLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading channels...</p>
                        </div>
                    ) : filteredChannels && filteredChannels.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
                            {filteredChannels.map(
                                (channel: WorkspaceChannel & { _count: Record<string, number> }) => (
                                    <Card
                                        key={channel.id}
                                        className="group gap-4 border-border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-md text-foreground"
                                    >
                                        <CardHeader className="pb-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="h-5 w-5 text-muted-foreground" />
                                                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                                            {channel.name}
                                                        </h3>
                                                    </div>
                                                    {channel.description && (
                                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                                            {channel.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardDescription className="px-6 pb-0 text-muted-foreground">
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Users className="h-4 w-4" />
                                                    <span className="font-medium text-foreground">
                                                        {channel._count.workspaceUsers}
                                                    </span>
                                                    <span>
                                                        {channel._count.workspaceUsers === 1
                                                            ? "member"
                                                            : "members"}
                                                    </span>
                                                </div>
                                                <Button variant="destructive" size="sm">
                                                    Leave Channel
                                                </Button>
                                            </div>
                                        </CardDescription>
                                    </Card>
                                )
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Hash className="mb-4 h-12 w-12 text-muted-foreground/35" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                No channels yet
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first channel to get started
                            </p>
                            <CreateChannelDialog>
                                <Button variant="default">
                                    <IoAdd size={18} className="mr-2" />
                                    Create Channel
                                </Button>
                            </CreateChannelDialog>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Channel;
