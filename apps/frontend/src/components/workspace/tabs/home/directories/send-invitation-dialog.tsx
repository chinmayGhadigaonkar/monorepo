"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2, Mail } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthClientSession } from "@/utils/auth-client";
import axiosInstance from "@/utils/axios-instance";

interface SendInvitePayload {
    inviteEmail: string;
    inviterName: string;
    workspaceId: string;
}

const sendWorkspaceInvite = async (payload: SendInvitePayload) => {
    const response = await axiosInstance.post("/api/send-workspace-invite", payload);
    return response.data;
};

interface SendInvitationDialogProps {
    children?: React.ReactNode;
}

const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({ children }) => {
    const params = useParams();
    const workspaceId = params?.workspaceId as string;
    const session = useAuthClientSession();
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");

    const { mutate: sendInvite, isPending } = useMutation({
        mutationFn: sendWorkspaceInvite,
        onSuccess: () => {
            toast.success("Invitation sent successfully!");
            setEmail("");
            setOpen(false);
        },
        onError: (error: AxiosError<{ error: string }>) => {
            const errorMessage = error.response?.data?.error || "Failed to send invitation";
            toast.error(errorMessage);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        sendInvite({
            inviteEmail: email,
            inviterName: session.data?.user?.name || "User",
            workspaceId,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground"
                    >
                        <Mail />
                        <span className="hidden sm:inline">Invite People</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invite People to Workspace</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Send an invitation link to join this workspace via email.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="colleague@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isPending}
                                className="w-full bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                            />
                            <p className="text-xs text-muted-foreground">
                                An invitation link will be sent to this email address
                            </p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isPending}
                            className="bg-transparent border-border hover:bg-accent hover:text-accent-foreground"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Invitation"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SendInvitationDialog;
