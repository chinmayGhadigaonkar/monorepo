"use client";

import { useState } from "react";
import { IoAdd } from "react-icons/io5";

import { Clock, Mail, Search, UserCheck, UserX, Users } from "lucide-react";
import { useParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetWorkspaceInvitations } from "@/hooks/useWorkspaceInvitation";
import { Invite } from "@/prisma-types/client";

import SendInvitationDialog from "./send-invitation-dialog";

type InvitationWithInviter = Invite & {
    inviter: {
        id: string;
        name: string;
        email: string;
        profileImage: string | null;
    };
};

const Invitation = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { workspaceId } = useParams();

    const { workspaceInvitationData, fetchWorkspaceInvitationLoading } = useGetWorkspaceInvitations(
        workspaceId as string
    );

    // Filter invitations based on search query
    const filteredInvitations = workspaceInvitationData?.filter((invitation: InvitationWithInviter) =>
        invitation.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                    </Badge>
                );
            case "ACCEPTED":
                return (
                    <Badge variant="outline" className="border-green-500 text-green-700">
                        <UserCheck className="mr-1 h-3 w-3" />
                        Accepted
                    </Badge>
                );
            case "REJECTED":
                return (
                    <Badge variant="outline" className="border-red-500 text-red-700">
                        <UserX className="mr-1 h-3 w-3" />
                        Rejected
                    </Badge>
                );
            default:
                return null;
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const isExpired = (expiryDate: Date) => {
        return new Date(expiryDate) < new Date();
    };

    return (
        <div className="flex h-full flex-col overflow-hidden bg-background text-foreground p-4">
            <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-border bg-background px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div className="relative flex-1 md:max-w-2xl">
                    <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                        <Search size={18} />
                    </span>
                    <Input
                        placeholder="Search by email address"
                        className="border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <SendInvitationDialog>
                    <Button variant={"outline"}>
                        <IoAdd size={15} className="my-auto text-inherit" />
                        Invite People
                    </Button>
                </SendInvitationDialog>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto bg-background">
                {/* Invitation Banner */}
                <div className="border-b border-border bg-gradient-to-r from-blue-600/90 to-blue-700/90 px-4 py-8 md:px-6 md:py-12">
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                        Invite people to your workspace
                    </h3>
                    <p className="mt-2 text-sm text-blue-50 md:text-base">
                        Send email invitations to colleagues and team members. They'll receive a link
                        to join your workspace and start collaborating.
                    </p>
                    <div className="mt-4">
                        <SendInvitationDialog>
                            <Button variant={"outline"} className="border-none bg-white/10 hover:bg-white/20 text-white">
                                <IoAdd size={15} className="my-auto text-inherit" />
                                Send Invitation
                            </Button>
                        </SendInvitationDialog>
                    </div>
                </div>

                {/* List of Invitations */}
                <div className="px-4 py-6 md:px-6">
                    {fetchWorkspaceInvitationLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading invitations...</p>
                        </div>
                    ) : filteredInvitations && filteredInvitations.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1">
                            {filteredInvitations.map((invitation: InvitationWithInviter) => (
                                <Card
                                    key={invitation.id}
                                    className="group gap-4 border-border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-md text-foreground"
                                >
                                    <CardHeader className="pb-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-5 w-5 text-muted-foreground" />
                                                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                                        {invitation.email}
                                                    </h3>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                    {getStatusBadge(invitation.status)}
                                                    {isExpired(invitation.expiryAt) &&
                                                        invitation.status === "PENDING" && (
                                                            <Badge
                                                                variant="outline"
                                                                className="border-red-500 text-red-700 bg-red-500/10"
                                                            >
                                                                Expired
                                                            </Badge>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardDescription className="px-6 pb-0 text-muted-foreground">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                                                <p>
                                                    Invited by{" "}
                                                    <span className="font-medium text-foreground">
                                                        {invitation.inviter.name}
                                                    </span>
                                                </p>
                                                <div className="flex flex-wrap gap-3 text-xs opacity-85">
                                                    <p>Sent: {formatDate(invitation.createdAt)}</p>
                                                    <p>Expires: {formatDate(invitation.expiryAt)}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {invitation.status === "PENDING" && (
                                                    <>
                                                        {/* <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                                        >
                                                            Resend
                                                        </Button>
                                                        <Button variant="destructive" size="sm">
                                                            Cancel
                                                        </Button> */}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </CardDescription>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Mail className="mb-4 h-12 w-12 text-muted-foreground/35" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {searchQuery ? "No invitations found" : "No invitations yet"}
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                {searchQuery
                                    ? "Try a different search term"
                                    : "Send your first invitation to get started"}
                            </p>
                            {!searchQuery && (
                                <SendInvitationDialog>
                                    <Button variant="default">
                                        <IoAdd size={18} className="mr-2" />
                                        Send Invitation
                                    </Button>
                                </SendInvitationDialog>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invitation;
