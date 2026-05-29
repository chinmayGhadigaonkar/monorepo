import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import z from "zod";

import { createWorkspaceChannel } from "@/actions/workspace-channel";
import { LoadingButton } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { workspaceChannelSchema } from "@/schema/workspace";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

const CreateChannelForm = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [createWorkspaceChannelLoading, startCreateWorkspaceChannelLoading] = useTransition();
    const form = useForm({
        resolver: zodResolver(workspaceChannelSchema),
        defaultValues: {
            name: "",
            topic: "",
            description: "",
        },
    });

    const handleOnSubmit = (data: z.infer<typeof workspaceChannelSchema>) => {
        startCreateWorkspaceChannelLoading(async () => {
            try {
                const response = await createWorkspaceChannel({ ...data, workspaceId });

                if (response.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                    form.reset();
                    toast.success(response.message);
                } else {
                    toast.error(response.message);
                }
            } catch (error: unknown) {
                toast.error("Failed to create workspace channel");
            }
        });
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="my-4 space-y-4">
                <div>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Channel Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Topic</FormLabel>
                                <FormControl>
                                    <Input placeholder="Channel Topic" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Channel Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Channel Description" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <LoadingButton
                    loading={createWorkspaceChannelLoading}
                    type="submit"
                    variant={"primary"}
                >
                    Create Workspace Channel
                </LoadingButton>
            </form>
        </Form>
    );
};

export default CreateChannelForm;
