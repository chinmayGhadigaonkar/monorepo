import React, { useState } from "react";

import { EllipsisVertical, FileText, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { WorkspaceChannel } from "@/prisma-types/client";

import ChannelAbout from "./about";
import ChannelMembers from "./members";

const tabs = [
    { id: "about", label: "About", icon: MessageCircle },
    { id: "members", label: "Members", icon: FileText },
];

const ChannelMenuDialog = ({ workspaceChannelData }: { workspaceChannelData: WorkspaceChannel }) => {
    const [activeTab, setActiveTab] = useState("about");
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="ghost" size="icon">
                    <EllipsisVertical />
                </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-gray-200 p-0">
                <DialogHeader className="border-b border-gray-200 px-4 pt-2">
                    <DialogTitle className="py-2">#{workspaceChannelData.name}</DialogTitle>
                    <div className="mt-2 flex gap-4 overflow-x-auto md:gap-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-black"
                                            : "border-transparent text-gray-600 hover:text-gray-900"
                                    }`}
                                >
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </DialogHeader>

                {activeTab === "about" && (
                    <ChannelAbout workspaceChannelData={workspaceChannelData} />
                )}

                {activeTab === "members" && (
                    <ChannelMembers workspaceChannelData={workspaceChannelData} />
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ChannelMenuDialog;
