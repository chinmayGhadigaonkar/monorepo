"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAcceptInvite, useGetInviteDetails, useRejectInvite } from "@/hooks/useInvite";

const InvitePage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = React.use(params);
    const router = useRouter();
    const [showDialog, setShowDialog] = useState(true);

    // Fetch invite details using TanStack Query
    const { data: inviteDetails, isLoading, error: fetchError } = useGetInviteDetails(id);

    // Accept invite mutation
    const acceptInvite = useAcceptInvite();

    // Reject invite mutation
    const rejectInvite = useRejectInvite();

    const handleAccept = async () => {
        acceptInvite.mutate(
            { inviteCode: id },
            {
                onSuccess: (data) => {
                    toast.success("Invite accepted successfully");
                    localStorage.setItem("inviteCode", id);
                    router.push(`/signin`);
                },
            }
        );
    };

    const handleReject = async () => {
        rejectInvite.mutate(
            { inviteCode: id },
            {
                onSuccess: () => {
                    toast.success("Invite rejected successfully");

                    setTimeout(() => {
                        window.close();
                    }, 100);
                },
            }
        );
    };

    const isProcessing = acceptInvite.isPending || rejectInvite.isPending;
    const error = fetchError || acceptInvite.error || rejectInvite.error;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (fetchError && !inviteDetails) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <h2 className="mb-2 text-xl font-semibold text-red-900">Invalid Invite</h2>
                    <p className="text-red-700">{fetchError.message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <Dialog
                open={showDialog}
                onOpenChange={() => {
                    setShowDialog(true);
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Workspace Invitation</DialogTitle>
                        <DialogDescription className="pt-2">
                            You&apos;ve been invited to join a workspace
                        </DialogDescription>
                    </DialogHeader>

                    {inviteDetails && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="mb-3 font-semibold text-gray-900">
                                    {inviteDetails.workspace.name}
                                </h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>
                                        <span className="font-medium">Invited by:</span>{" "}
                                        {inviteDetails.inviter.name}
                                    </p>
                                    <p>
                                        <span className="font-medium">Email:</span>{" "}
                                        {inviteDetails.inviter.email}
                                    </p>
                                    <p>
                                        <span className="font-medium">Expires:</span>{" "}
                                        {new Date(inviteDetails.expiryAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                                    {error.message}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="space-x-4">
                        <Button
                            variant="outline"
                            onClick={handleReject}
                            disabled={isProcessing}
                            className="w-full sm:w-auto"
                        >
                            {rejectInvite.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Reject"
                            )}
                        </Button>
                        <Button
                            onClick={handleAccept}
                            disabled={isProcessing}
                            className="w-full sm:w-auto"
                        >
                            {acceptInvite.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Accept Invitation"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default InvitePage;
