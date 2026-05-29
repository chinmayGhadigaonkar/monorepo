"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2 } from "lucide-react";

import { getPreSignedUrl, uploadFileToStroage } from "@/actions/storage";
import updateUserAction from "@/actions/user";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type UserProfileFormData, userProfileSchema } from "@/schema/user";
import { SERVER_RESPONSE_STATUS } from "@/types/base";

interface EditProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentData: {
        name: string;
        phone?: string;
        designation?: string;
        status?: string;
        profileImage?: string;
    };
    onSuccess?: () => void;
}

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "away", label: "Away" },
    { value: "do not disturb", label: "Do Not Disturb" },
    { value: "offline", label: "Offline" },
] as const;

export const EditProfileDialog: React.FC<EditProfileDialogProps> = ({
    isOpen,
    onClose,
    userId,
    currentData,
    onSuccess,
}) => {
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(currentData.profileImage || null);
    const [isUploading, startUploadTransition] = useTransition();
    const [isSaving, startSaveTransition] = useTransition();
    const queryClient = useQueryClient();

    const fileRef = React.useRef<HTMLInputElement | null>(null);

    const form = useForm<UserProfileFormData>({
        resolver: zodResolver(userProfileSchema),
        defaultValues: {
            name: currentData.name || "",
            phone: currentData.phone || "",
            designation: currentData.designation || "",
            status: (currentData.status as UserProfileFormData["status"]) || "active",
            profileImage: currentData.profileImage || "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            setProfileImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!profileImage) return null;

        try {
            if (profileImage.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB limit");
                return null;
            }
            // Get presigned URL
            const presignedResponse = await getPreSignedUrl(profileImage.name, profileImage.type);

            if (presignedResponse.status !== SERVER_RESPONSE_STATUS.SUCCESS) {
                throw new Error(presignedResponse.message || "Failed to get upload URL");
            }

            const signedUrl = presignedResponse.data?.url;
            if (!signedUrl) {
                throw new Error("No upload URL received");
            }

            // Upload to storage
            const uploadResponse = await uploadFileToStroage(
                signedUrl,
                profileImage.type,
                profileImage
            );

            if (uploadResponse.status !== SERVER_RESPONSE_STATUS.SUCCESS) {
                throw new Error(uploadResponse.message || "Failed to upload image");
            }

            return uploadResponse.data?.url || null;
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to upload image");
            return null;
        }
    };

    const handleOnSubmit = (data: UserProfileFormData) => {
        startSaveTransition(async () => {
            try {
                // Upload image if selected
                let imageUrl = data.profileImage;
                if (profileImage) {
                    startUploadTransition(async () => {
                        const uploadedUrl = await uploadImage();
                        if (!uploadedUrl) {
                            return; // Error already shown by uploadImage
                        }
                        imageUrl = uploadedUrl;
                    });

                    // Wait for upload to complete
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    const uploadedUrl = await uploadImage();
                    if (!uploadedUrl) {
                        return; // Error already shown by uploadImage
                    }
                    imageUrl = uploadedUrl;
                }

                // Update user
                // eslint-disable-next-line  @typescript-eslint/no-explicit-any
                const updateData: { [key: string]: string | null } = {
                    name: data.name,
                    phone: data.phone || null,
                    designation: data.designation || null,
                    status: data.status,
                };

                if (imageUrl) {
                    updateData.profileImage = imageUrl;
                }

                const response = await updateUserAction(userId, updateData);

                if (response.status !== SERVER_RESPONSE_STATUS.SUCCESS) {
                    throw new Error(response.message || "Failed to update profile");
                }

                // Success
                toast.success("Profile updated successfully");
                queryClient.invalidateQueries({ queryKey: ["people"] });
                onSuccess?.();
                onClose();
                form.reset();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to save profile");
            }
        });
    };

    const handleClose = () => {
        if (!isSaving && !isUploading) {
            form.reset();
            setProfileImage(null);
            setImagePreview(currentData.profileImage || null);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-background border-border text-foreground sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Update your profile information and photo
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSubmit)} className="space-y-4 py-4">
                        {/* Profile Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-muted border border-border">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Profile preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <svg
                                            className="h-12 w-12 text-muted-foreground/60"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    )}
                                </div>
                                <label
                                    htmlFor="profile-image"
                                    className="bg-btn-color hover:bg-btn-color/80 absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white transition-colors"
                                >
                                    <Camera size={16} />
                                    <input
                                        id="profile-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        disabled={isUploading || isSaving}
                                        ref={fileRef}
                                    />
                                </label>
                            </div>
                            {profileImage && (
                                <p className="text-sm text-muted-foreground">{profileImage.name}</p>
                            )}
                        </div>

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
                                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                                            disabled={isSaving || isUploading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone */}
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Phone Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your phone number"
                                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                                            disabled={isSaving || isUploading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Designation */}
                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Designation</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your designation"
                                            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring"
                                            disabled={isSaving || isUploading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-foreground">Status</FormLabel>
                                    <FormControl>
                                        <select
                                            className="flex h-10 w-full rounded-md border border-border bg-card text-foreground px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isSaving || isUploading}
                                            {...field}
                                        >
                                            {STATUS_OPTIONS.map((option) => (
                                                <option key={option.value} value={option.value} className="bg-popover text-popover-foreground">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSaving || isUploading}
                                className="bg-transparent border-border hover:bg-accent hover:text-accent-foreground"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving || isUploading}>
                                {isSaving || isUploading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {isUploading ? "Uploading..." : "Saving..."}
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
