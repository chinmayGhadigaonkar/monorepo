import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

import { updateChannelDetails } from "@/actions/workspace-channel";
import { Button, LoadingButton } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceChannel } from "@/prisma-types/client";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

interface EditDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    value: string;
    setValue: (val: string) => void;
    maxLength: number;
    isPending: boolean;
    handleUpdate: () => void;
    field: "name" | "topic" | "description";
}

const EditDialog = ({
    isOpen,
    onOpenChange,
    title,
    description: desc,
    value,
    setValue,
    maxLength,
    isPending,
    handleUpdate,
    field,
}: EditDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{desc}</DialogDescription>
            </DialogHeader>
            <div className="relative">
                {field === "description" ? (
                    <Textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        maxLength={maxLength}
                        className="min-h-[100px]"
                    />
                ) : (
                    <Input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        maxLength={maxLength}
                    />
                )}
                <div className="mt-1 text-right text-xs text-gray-500">
                    {maxLength - value.length} characters remaining
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>

                <LoadingButton
                    onClick={handleUpdate}
                    disabled={isPending}
                    loading={isPending}
                    className="bg-btn-color"
                >
                    Save
                </LoadingButton>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);

const ChannelAbout = ({ workspaceChannelData }: { workspaceChannelData: WorkspaceChannel }) => {
    const [channelName, setChannelName] = useState(workspaceChannelData.name);
    const [topic, setTopic] = useState(workspaceChannelData.topic || "");
    const [description, setDescription] = useState(workspaceChannelData.description || "");
    const queryClient = useQueryClient();

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const [editingField, setEditingField] = useState<"name" | "topic" | "description" | null>(null);

    const handleUpdate = async () => {
        if (!editingField) return;

        startTransition(async () => {
            const payload = {
                channelId: workspaceChannelData.id,
                workspaceId: workspaceChannelData.workspaceId!,
                [editingField]:
                    editingField === "name"
                        ? channelName
                        : editingField === "topic"
                          ? topic
                          : description,
            };

            const response = await updateChannelDetails(payload);

            if (response.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                toast.success(response.message);
                setEditingField(null);
                router.refresh();
                queryClient.invalidateQueries({
                    queryKey: ["workspace", workspaceChannelData.workspaceId, "channel"],
                });
            } else {
                toast.error(response.message);
            }
        });
    };

    return (
        <div className="flex flex-col px-4">
            <div className="my-4 divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200">
                <div className="px-4 py-4">
                    <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                            <div className="mb-1 text-xs font-bold text-gray-500">Channel name</div>
                            <div className="font-semibold text-gray-900">
                                # {workspaceChannelData.name}
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="h-auto p-0 font-semibold text-blue-600"
                            onClick={() => setEditingField("name")}
                        >
                            Edit
                        </Button>
                    </div>
                    <EditDialog
                        isOpen={editingField === "name"}
                        onOpenChange={(open) => !open && setEditingField(null)}
                        field="name"
                        title="Rename this channel"
                        description="Names must be lowercase, without spaces or periods, and can’t be longer than 80 characters."
                        value={channelName}
                        setValue={setChannelName}
                        maxLength={80}
                        isPending={isPending}
                        handleUpdate={handleUpdate}
                    />
                </div>

                <div className="px-4 py-4">
                    <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                            <div className="mb-1 text-xs font-bold text-gray-500">Topic</div>
                            <div className="text-gray-900">
                                {workspaceChannelData.topic || "Add a topic"}
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="h-auto p-0 font-semibold text-blue-600"
                            onClick={() => setEditingField("topic")}
                        >
                            Edit
                        </Button>
                    </div>
                    <EditDialog
                        isOpen={editingField === "topic"}
                        onOpenChange={(open) => !open && setEditingField(null)}
                        field="topic"
                        title="Edit topic"
                        description="Let people know what this channel is focused on."
                        value={topic}
                        setValue={setTopic}
                        maxLength={250}
                        isPending={isPending}
                        handleUpdate={handleUpdate}
                    />
                </div>

                <div className="px-4 py-4">
                    <div className="mb-2 flex items-start justify-between">
                        <div className="flex-1">
                            <div className="mb-1 text-xs font-bold text-gray-500">Description</div>
                            <div className="text-sm text-gray-900">
                                {workspaceChannelData.description || "Add a description"}
                            </div>
                        </div>
                        <Button
                            variant="link"
                            className="h-auto p-0 font-semibold text-blue-600"
                            onClick={() => setEditingField("description")}
                        >
                            Edit
                        </Button>
                    </div>
                    <EditDialog
                        isOpen={editingField === "description"}
                        onOpenChange={(open) => !open && setEditingField(null)}
                        field="description"
                        title="Edit description"
                        description="Let people know what this channel is for."
                        value={description}
                        setValue={setDescription}
                        maxLength={250}
                        isPending={isPending}
                        handleUpdate={handleUpdate}
                    />
                </div>

                <div className="px-4 py-4">
                    <div className="flex flex-col">
                        <div className="mb-1 text-xs font-bold text-gray-500">Created by</div>
                        <div className="text-sm text-gray-900"></div>
                        <div className="text-sm text-gray-900">
                            Created on{" "}
                            {format(new Date(workspaceChannelData.createdAt), "MMMM d, yyyy")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChannelAbout;
