"use client";

import React, { useState } from "react";
import { CiFileOn } from "react-icons/ci";
import { FaFile } from "react-icons/fa";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { IoHomeOutline, IoHomeSharp } from "react-icons/io5";
import { PiChatsCircleFill, PiChatsTeardropLight } from "react-icons/pi";
import { RiSettings4Line } from "react-icons/ri";

import Link from "next/link";
import { useParams } from "next/navigation";

import { useConfigurator } from "@/lib/configurator-context";
import { WorkspaceTab } from "@/types/workspace";

import WorkSpaceSwitchter from "../workspace/workspace-switcher";
import ConfiguratorPanel from "./configurator-panel";

const Tabs = [
    { name: "Home", href: "home", icon: IoHomeOutline, activeIcon: IoHomeSharp },
    { name: "DMs", href: "dms", icon: PiChatsTeardropLight, activeIcon: PiChatsCircleFill },
    {
        name: "Activity",
        href: "activity",
        icon: IoIosNotificationsOutline,
        activeIcon: IoIosNotifications,
    },
    { name: "Files", href: "files", icon: CiFileOn, activeIcon: FaFile },
];

const DENSITY_PADDING: Record<string, string> = {
    compact: "4px",
    comfortable: "8px",
    airy: "14px",
};

const LeftNavigationBar = () => {
    const { tab: activeTab, workspaceId } = useParams<{ tab: WorkspaceTab; workspaceId: string }>();
    const [configuratorOpen, setConfiguratorOpen] = useState(false);
    const { config, sidebarStyles } = useConfigurator();

    return (
        <>
            <aside
                className="bg-sidebar text-sidebar-foreground border-sidebar-border/30 flex w-20 flex-col border-r px-2 transition-colors duration-200"
                style={{ paddingTop: DENSITY_PADDING[config.sidebarStyle] }}
            >
                {/* Workspace Switcher */}
                <div className="mx-auto w-fit py-2">
                    <WorkSpaceSwitchter />
                </div>

                {/* Nav Tabs */}
                <ul className={`mt-2 flex flex-col items-center ${sidebarStyles.gap}`}>
                    {Tabs.map((tab) => {
                        const isActive = tab.name.toLowerCase() === activeTab;
                        return (
                            <li key={tab.name} className="group/item flex flex-col items-center">
                                <Link href={`/workspace/${workspaceId}/${tab.href}`}>
                                    <div
                                        className={` ${sidebarStyles.iconSize} ${isActive ? "bg-btn-color border-transparent text-white" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"} flex cursor-pointer items-center justify-center rounded-md p-2 transition-all duration-200`}
                                    >
                                        {isActive ? (
                                            <tab.activeIcon className="size-5 text-white" />
                                        ) : (
                                            <tab.icon className="size-5 text-inherit transition-colors" />
                                        )}
                                    </div>
                                </Link>
                                <p
                                    className={`mt-1 text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                                        isActive
                                            ? "text-sidebar-foreground font-bold"
                                            : "text-sidebar-foreground/60 group-hover/item:text-sidebar-foreground"
                                    }`}
                                >
                                    {tab.name}
                                </p>
                            </li>
                        );
                    })}
                </ul>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Configurator Button */}
                <div className="group/btn mb-4 flex flex-col items-center">
                    <button
                        id="open-configurator-btn"
                        onClick={() => setConfiguratorOpen(true)}
                        className={` ${sidebarStyles.iconSize} group hover:bg-sidebar-accent/50 text-sidebar-foreground/60 hover:text-sidebar-foreground flex cursor-pointer items-center justify-center rounded-md transition-all duration-200`}
                        title="Configurator"
                        style={{
                            border: configuratorOpen
                                ? "2px solid var(--color-btn-color)"
                                : "2px solid transparent",
                        }}
                    >
                        <RiSettings4Line
                            className="transition-transform duration-300 group-hover:rotate-45"
                            style={{ fontSize: "1.2rem" }}
                        />
                    </button>
                    <p className="text-sidebar-foreground/60 group-hover/btn:text-sidebar-foreground mt-1 text-[10px] font-semibold tracking-wide transition-colors duration-200">
                        Theme
                    </p>
                </div>
            </aside>

            {/* Configurator Sheet */}
            <ConfiguratorPanel open={configuratorOpen} onClose={() => setConfiguratorOpen(false)} />
        </>
    );
};

export default LeftNavigationBar;
