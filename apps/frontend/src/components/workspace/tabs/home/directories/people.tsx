"use client";

import React, { Suspense } from "react";

import { AvatarFallback } from "@radix-ui/react-avatar";
import { Search } from "lucide-react";
import { useParams } from "next/navigation";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import useGetPeople from "@/hooks/useDIrectory";
import { People as PeopleType } from "@/types/people";

import ProfileSection from "./profile-section";
import SendInvitationDialog from "./send-invitation-dialog";

const People = () => {
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedUser, setSelectedUser] = React.useState<PeopleType | null>(null);
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);
    const { workspaceId } = useParams<{ workspaceId: string }>();

    const {
        people: initialPeople,
        fetchPeopleLoading,
        error,
    } = useGetPeople({
        workspaceId: workspaceId as string,
        search: "",
    });

    const filteredPeople = React.useMemo(() => {
        if (!initialPeople) return [];
        if (!searchQuery) return initialPeople;
        return initialPeople.filter((person) =>
            person.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [initialPeople, searchQuery]);

    const handleUserClick = (user: PeopleType) => {
        setSelectedUser(user);
        setIsProfileOpen(true);
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-background text-foreground">
            {/* Search Bar */}
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="relative flex-1 md:max-w-2xl">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                        <Search size={18} />
                    </span>
                    <Input
                        placeholder="Search for people"
                        className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <SendInvitationDialog />
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto bg-background">
                {/* Invitation Banner */}
                <div className="border-b border-border bg-gradient-to-r from-blue-600/90 to-blue-700/90 px-4 py-8 md:px-6 md:py-12">
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                        Invite your team to TeamSync
                    </h3>
                    <p className="mt-2 text-sm text-blue-50 md:text-base">
                        Bring your team members into TeamSync to start working better together. Send
                        invites via email, or get a handy link to share.
                    </p>
                    <div className="mt-4">
                        <SendInvitationDialog />
                    </div>
                </div>

                {/* User Cards Grid */}
                <div className="mb-8 flex-1 bg-background px-4 py-6 md:px-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                            {filteredPeople?.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserClick(user)}
                                    className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-md"
                                >
                                    {/* Avatar */}
                                    <div
                                        className={`h-32 ${user.color} flex items-center justify-center`}
                                    >
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30 backdrop-blur-sm">
                                            <Avatar className="h-20 w-20">
                                                <AvatarImage src={user.profileImage} />
                                                <AvatarFallback className="text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="p-4">
                                        <h4 className="truncate font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                            {user.name}
                                        </h4>
                                        {user.status === "invited" ? (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Invited member
                                            </p>
                                        ) : (
                                            <>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {user.name}
                                                </p>
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-xs text-muted-foreground">
                                                        Active
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </Suspense>
                    </div>

                    {filteredPeople?.length === 0 && (
                        <div className="flex h-64 items-center justify-center">
                            <p className="text-muted-foreground">No people found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Section */}
            <ProfileSection
                user={selectedUser}
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
        </div>
    );
};

export default People;
