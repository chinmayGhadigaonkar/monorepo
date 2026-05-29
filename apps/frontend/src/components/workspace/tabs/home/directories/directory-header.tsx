"use client";

import React from "react";

import { Hash, Mail, Users } from "lucide-react";

const tabs = [
    { id: "people", label: "People", icon: Users },
    { id: "channels", label: "Channels", icon: Hash },
    { id: "invitations", label: "Invitations", icon: Mail },
];

interface DirectoryHeaderProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function DirectoryHeader({ activeTab, setActiveTab }: DirectoryHeaderProps) {
    return (
        <div className="flex w-full flex-col space-y-2 border-b border-border bg-background px-4 pt-4 md:px-6 text-foreground">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground md:text-xl">Directories</h2>
            </div>

            <div className="mt-3 flex gap-4 overflow-x-auto md:gap-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex cursor-pointer items-center gap-2 border-b-2 pb-2 text-sm whitespace-nowrap transition-colors duration-200 ${
                                activeTab === tab.id
                                    ? "border-btn-color text-foreground font-medium"
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

export default DirectoryHeader;
