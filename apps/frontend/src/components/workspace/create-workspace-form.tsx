import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdEdit } from "react-icons/md";

import { zodResolver } from "@hookform/resolvers/zod";
import { LayersIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import z from "zod";

import { getPreSignedUrl, uploadFileToStroage } from "@/actions/storage";
import { createWorkspace } from "@/actions/workspace";
import { workspaceSchema } from "@/schema/workspace";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

import { Button, LoadingButton } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const CreateWorkSpaceForm = () => {
    const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
    const [createWorkspaceLoading, startCreateWorkspaceTransition] = useTransition();
    const [workspaceImageUploadLoading, startWorkspaceImageUploadTransition] = useTransition();

    const fileRef = React.useRef<HTMLInputElement | null>(null);

    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(workspaceSchema),
        defaultValues: {
            name: "",
            profileImage: undefined,
        },
    });

    const handleOnFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        startWorkspaceImageUploadTransition(async () => {
            if (e.target.files) {
                const file = e.target.files[0];

                if (!file) return;

                if (file.size > 5 * 1024 * 1024) {
                    toast.error("File size exceeds 5MB limit");
                    return;
                }

                try {
                    const signedUrlResponse = await getPreSignedUrl(file.name, file.type);

                    if (signedUrlResponse.status === SERVER_RESPONSE_STATUS.FAILED) {
                        toast.error(signedUrlResponse.message);
                        return;
                    }

                    const uploadUrlResponse = await uploadFileToStroage(
                        signedUrlResponse.data.url,
                        file.type,
                        file
                    );

                    if (uploadUrlResponse.status === SERVER_RESPONSE_STATUS.FAILED) {
                        toast.error(uploadUrlResponse.message);
                        return;
                    }
                    setSelectedFileUrl(uploadUrlResponse.data.url);
                    form.setValue("profileImage", uploadUrlResponse.data.url);
                } catch (error) {
                    toast.error("Something went wrong while uploading image");
                }
            }
        });
    };

    const handleOnSubmit = (data: z.infer<typeof workspaceSchema>) => {
        startCreateWorkspaceTransition(async () => {
            try {
                const response = await createWorkspace(data);

                if (response.status === SERVER_RESPONSE_STATUS.SUCCESS) {
                    toast.success(response.message);
                    form.reset();
                    return router.replace(`/workspace/${response.data.id}`);
                } else {
                    const { message } = response;
                    toast.error(message || "Something went wrong");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleOnSubmit)} className="w-full space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="workspace name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name="profileImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Workspace Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        {...field}
                                        onChange={handleOnFileChange}
                                        value={undefined}
                                        ref={fileRef}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="relative my-4 w-fit">
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-300">
                            {workspaceImageUploadLoading && !selectedFileUrl && (
                                <Loader2Icon className="animate-spin" />
                            )}
                            {!workspaceImageUploadLoading && selectedFileUrl && (
                                <Image
                                    src={selectedFileUrl}
                                    alt="workspace"
                                    fill
                                    className="h-10 w-10 overflow-hidden rounded-full"
                                />
                            )}
                            {!workspaceImageUploadLoading && !selectedFileUrl && (
                                <LayersIcon className="h-10 w-10" />
                            )}
                        </div>
                        <Button
                            disabled={workspaceImageUploadLoading}
                            type="button"
                            size={"icon-sm"}
                            variant={"primary"}
                            className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                            onClick={() => (fileRef.current ? fileRef.current.click() : null)}
                        >
                            <MdEdit />
                        </Button>
                    </div>
                </div>
                <LoadingButton loading={createWorkspaceLoading} type="submit" variant={"primary"}>
                    Create Workspace
                </LoadingButton>
            </form>
        </Form>
    );
};

export default CreateWorkSpaceForm;
