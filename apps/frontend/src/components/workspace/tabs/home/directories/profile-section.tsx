"use client";

import React, { useEffect, useState } from "react";

import { ChevronDown, Clock, Mail, MoreVertical } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { People } from "@/types/people";

import { EditProfileDialog } from "./edit-profile-dialog";

interface ProfileSectionProps {
    user: People | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, isOpen, onClose }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);

    // Update currentUser when user prop changes
    useEffect(() => {
        setCurrentUser(user);
    }, [user]);

    if (!currentUser) return null;

    // Get current time in 12-hour format
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const handleEditClick = () => {
        setIsEditDialogOpen(true);
    };

    const handleEditSuccess = () => {
        // Refresh user data - in a real app, you'd fetch the updated data
        // For now, we'll just close the dialog
        setIsEditDialogOpen(false);
        // You might want to trigger a refresh of the user data here
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full overflow-y-auto border-border bg-background p-0 md:w-[480px] text-foreground">
                    <SheetHeader className="border-b border-border px-6 py-4">
                        <SheetTitle className="text-lg font-semibold text-foreground">
                            Profile
                        </SheetTitle>
                    </SheetHeader>

                    {/* Content */}
                    <div className="overflow-y-auto">
                        {/* Avatar Section */}
                        <div className="relative px-6 pt-6">
                            <div
                                className={`relative flex h-48 items-center justify-center rounded-lg ${currentUser.color} `}
                            >
                                {/* Upload Photo Button */}
                                <button
                                    onClick={handleEditClick}
                                    className="absolute top-3 right-3 rounded bg-black/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/30 transition-colors"
                                >
                                    Upload Photo
                                </button>

                                {/* Avatar Circle */}
                                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                                    {currentUser.profileImage ? (
                                        <img
                                            src={currentUser.profileImage}
                                            alt={currentUser.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <svg
                                            className="h-20 w-20 text-white"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold text-foreground">
                                    {currentUser.name}
                                </h3>
                                <button
                                    onClick={handleEditClick}
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>

                            {/* Designation */}
                            {currentUser.designation && (
                                <p className="mt-3 text-sm text-muted-foreground">
                                    {currentUser.designation}
                                </p>
                            )}

                            {/* Status */}
                            {currentUser.status === "active" && (
                                <div className="mt-4 flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
                                    <span className="text-sm text-muted-foreground">Active</span>
                                </div>
                            )}

                            {/* Local Time */}
                            <div className="mt-3 flex items-center gap-2 text-muted-foreground">
                                <Clock size={16} />
                                <span className="text-sm">{getCurrentTime()} local time</span>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="mt-4 border-t border-border px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h4 className="font-semibold text-foreground">Contact information</h4>
                                <button
                                    onClick={handleEditClick}
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                >
                                    Edit
                                </button>
                            </div>

                            {/* Email */}
                            <div className="mt-4 flex items-start gap-3">
                                <div className="rounded bg-muted p-2 border border-border">
                                    <Mail size={18} className="text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                    <a
                                        href={`mailto:${currentUser.email || "user@example.com"}`}
                                        className="mt-1 text-sm text-primary hover:text-primary/80 transition-colors inline-block"
                                    >
                                        {currentUser.email || "user@example.com"}
                                    </a>
                                </div>
                            </div>

                            {/* Phone */}
                            {currentUser.phone && (
                                <div className="mt-4 flex items-start gap-3">
                                    <div className="rounded bg-muted p-2 border border-border">
                                        <svg
                                            className="h-[18px] w-[18px] text-muted-foreground"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-muted-foreground">Phone Number</p>
                                        <p className="mt-1 text-sm text-foreground">
                                            {currentUser.phone}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* About Section */}
                        {currentUser.role && (
                            <div className="mt-4 border-t border-border px-6 py-4">
                                <h4 className="font-semibold text-foreground">Role</h4>
                                <p className="mt-2 text-sm text-muted-foreground">{currentUser.role}</p>
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>

            {/* Edit Profile Dialog */}
            <EditProfileDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                userId={currentUser.id}
                currentData={{
                    name: currentUser.name,
                    phone: currentUser.phone,
                    designation: currentUser.designation,
                    status: currentUser.status,
                    profileImage: currentUser.profileImage,
                }}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};

export default ProfileSection;
