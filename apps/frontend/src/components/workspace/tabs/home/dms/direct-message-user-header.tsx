import React from "react";

import { FileText, Mail, MessageCircle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { User, WorkspaceChannel } from "@/prisma-types/client";

const tabs = [
    { id: "messages", label: "Messages", icon: MessageCircle },
    { id: "files", label: "Files", icon: FileText },
];

function DirectUserHeader({
    userData,
    activeTab,
    setActiveTab,
}: Readonly<{
    userData: User;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}>) {
    return (
        <div className="flex w-full flex-col space-y-2 border-b bg-background px-4 pt-4 md:px-6">
            <div className="flex justify-between">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-foreground md:text-xl">{userData.name}</h2>
                </div>
            </div>

            <div className="mt-3 flex gap-4 overflow-x-auto md:gap-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm whitespace-nowrap transition-colors ${
                                activeTab === tab.id
                                    ? "border-btn-color text-foreground"
                                    : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default DirectUserHeader;
